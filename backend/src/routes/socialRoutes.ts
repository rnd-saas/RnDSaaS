import { Router, type Request } from 'express';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../db/supabase';
import { requireAuth } from '../middleware/requireAuth';

const router = Router();

interface AuthedRequest extends Request {
    user?: User;
}

router.use(requireAuth as any);

router.get('/users', async (req: AuthedRequest, res) => {
    try {
        const rawQuery = typeof req.query.q === 'string' ? req.query.q.trim() : '';
        const currentUserId = req.user?.id;

        if (!rawQuery) {
            return res.json([]);
        }

        const sanitizedQuery = rawQuery.replace(/[%_,]/g, (match) => `\\${match}`);

        const { data, error } = await supabase
            .from('users')
            .select(`id, username, display_name, user_info( avatar_option ) `)
            .or(`display_name.ilike.%${sanitizedQuery}%,username.ilike.%${sanitizedQuery}%`)
            .neq('id', currentUserId ?? '')
            .order('display_name', { ascending: true })
            .limit(8);

        if (error) {
            return res.status(400).json({ error: { message: error.message } });
        }

        const users = data ?? [];

        // If no current user or no results, return as is
        if (!currentUserId || users.length === 0) {
            return res.json(users);
        }

        const targetIds = users.map((u) => u.id);
        const { data: relations, error: relError } = await supabase
            .from('friends')
            .select('requester_id, addressee_id, status')
            .or(
                `and(requester_id.eq.${currentUserId},addressee_id.in.(${targetIds.join(',')})),` +
                `and(requester_id.in.(${targetIds.join(',')}),addressee_id.eq.${currentUserId})`
            );

        if (relError) {
            return res.status(400).json({ error: { message: relError.message } });
        }

        const statusMap = new Map<string, string>();
        (relations || []).forEach((r) => {
            if (r.status === 'accepted') {
                statusMap.set(r.requester_id === currentUserId ? r.addressee_id : r.requester_id, 'accepted');
            } else if (r.status === 'pending') {
                if (r.requester_id === currentUserId) {
                    statusMap.set(r.addressee_id, 'pending_outgoing');
                } else if (r.addressee_id === currentUserId) {
                    statusMap.set(r.requester_id, 'pending_incoming');
                }
            }
        });

        const merged = users.map((u) => ({
            ...u,
            friend_status: statusMap.get(u.id) || null
        }));

        res.json(merged);
    } catch (error: any) {
        console.error('Social search users error:', error);
        res.status(500).json({ error: { message: 'Internal server error' } });
    }
});

router.get('/posts', async (req: AuthedRequest, res) => {
    try {
        const currentUserId = req.user?.id;

        if (!currentUserId) {
            return res.status(401).json({ error: { message: 'Unauthorized' } });
        }

        const { data: friends, error: friendsError } = await supabase
            .from('friends')
            .select('requester_id, addressee_id, status')
            .eq('status', 'accepted')
            .or(`requester_id.eq.${currentUserId},addressee_id.eq.${currentUserId}`);

        if (friendsError) {
            return res.status(400).json({ error: { message: friendsError.message } });
        }

        const allowedAuthorIds = new Set<string>([currentUserId]);

        (friends ?? []).forEach((relation) => {
            if (relation.requester_id === currentUserId) {
                allowedAuthorIds.add(relation.addressee_id);
            } else {
                allowedAuthorIds.add(relation.requester_id);
            }
        });

        const authorIds = Array.from(allowedAuthorIds);

        const { data, error } = await supabase
            .from('posts')
            .select(
                `id, body, created_at,
                author:users!posts_author_id_fkey (id, username, display_name, user_info( avatar_option ))`
            )
            .in('author_id', authorIds)
            .order('created_at', { ascending: false })
            .limit(20);

        if (error) {
            return res.status(400).json({ error: { message: error.message } });
        }

        res.json(
            (data ?? []).map((post) => ({
                ...post,
                body: post.body ?? '',
                author: post.author ?? null
            }))
        );
    } catch (error: any) {
        console.error('Social posts fetch error:', error);
        res.status(500).json({ error: { message: 'Internal server error' } });
    }
});

router.post('/posts', async (req: AuthedRequest, res) => {
    try {
        const currentUserId = req.user?.id;

        if (!currentUserId) {
            return res.status(401).json({ error: { message: 'Unauthorized' } });
        }

        const body = typeof req.body?.body === 'string' ? req.body.body.trim() : '';

        if (!body) {
            return res.status(400).json({ error: { message: 'Post body is required' } });
        }

        if (body.length > 280) {
            return res.status(400).json({ error: { message: 'Post body must be 280 characters or less' } });
        }

        const { data: newPost, error } = await supabase
            .from('posts')
            .insert([{ author_id: currentUserId, body }])
            .select(
                `id, body, created_at,
                author:users!posts_author_id_fkey (id, username, display_name)`
            )
            .single();

        if (error) {
            return res.status(400).json({ error: { message: error.message } });
        }

        res.status(201).json({
            ...newPost,
            author: newPost.author ?? null
        });
    } catch (error: any) {
        console.error('Social post creation error:', error);
        res.status(500).json({ error: { message: 'Internal server error' } });
    }
});

router.get('/friends', async (req: AuthedRequest, res) => {
    try {
        const currentUserId = req.user?.id;

        if (!currentUserId) {
            return res.status(401).json({ error: { message: 'Unauthorized' } });
        }

        // Get all friend relations where current user is either requester or addressee
        const { data: relations, error } = await supabase
            .from('friends')
            .select(
                `id, requester_id, addressee_id, status, created_at, updated_at,
                requester:users!friends_requester_id_fkey (id, username, display_name, user_info( avatar_option )),
                addressee:users!friends_addressee_id_fkey (id, username, display_name, user_info( avatar_option ))`
            )
            .or(`requester_id.eq.${currentUserId},addressee_id.eq.${currentUserId}`)
            .order('created_at', { ascending: false });

        if (error) {
            return res.status(400).json({ error: { message: error.message } });
        }

        res.json(relations ?? []);
    } catch (error: any) {
        console.error('Social friends fetch error:', error);
        res.status(500).json({ error: { message: 'Internal server error' } });
    }
});

router.post('/friends', async (req: AuthedRequest, res) => {
    try {
        const currentUserId = req.user?.id;
        const targetUserId = typeof req.body?.targetUserId === 'string' ? req.body.targetUserId.trim() : '';

        if (!currentUserId) {
            return res.status(401).json({ error: { message: 'Unauthorized' } });
        }

        if (!targetUserId) {
            return res.status(400).json({ error: { message: 'targetUserId is required' } });
        }

        if (targetUserId === currentUserId) {
            return res.status(400).json({ error: { message: 'Cannot send a friend request to yourself' } });
        }

        const { data: targetUser, error: targetError } = await supabase
            .from('users')
            .select('id')
            .eq('id', targetUserId)
            .single();

        if (targetError || !targetUser) {
            return res.status(404).json({ error: { message: 'Target user not found' } });
        }

        const { data: existingRelation, error: existingError } = await supabase
            .from('friends')
            .select('*')
            .or(
                `and(requester_id.eq.${currentUserId},addressee_id.eq.${targetUserId}),` +
                    `and(requester_id.eq.${targetUserId},addressee_id.eq.${currentUserId})`
            )
            .maybeSingle();

        if (existingError && existingError.code !== 'PGRST116') {
            return res.status(400).json({ error: { message: existingError.message } });
        }

        if (existingRelation) {
            // Already friends
            if (existingRelation.status === 'accepted') {
                return res.status(400).json({ error: { message: 'You are already friends' } });
            }

            // The other user sent a pending request to current user → auto-accept
            if (
                existingRelation.status === 'pending' &&
                existingRelation.requester_id === targetUserId &&
                existingRelation.addressee_id === currentUserId
            ) {
                const { data: updatedRelation, error: updateError } = await supabase
                    .from('friends')
                    .update({ status: 'accepted', updated_at: new Date().toISOString() })
                    .eq('id', existingRelation.id)
                    .select()
                    .single();

                if (updateError) {
                    return res.status(400).json({ error: { message: updateError.message } });
                }

                return res.json(updatedRelation);
            }

            // Current user already sent a pending request → block duplicate
            if (
                existingRelation.status === 'pending' &&
                existingRelation.requester_id === currentUserId &&
                existingRelation.addressee_id === targetUserId
            ) {
                return res.status(400).json({ error: { message: 'Friend request already sent' } });
            }

            // Fallback: block any other state
            return res.status(400).json({ error: { message: 'Cannot create duplicate friend request' } });
        }

        const { data: newRelation, error } = await supabase
            .from('friends')
            .insert([{ requester_id: currentUserId, addressee_id: targetUserId }])
            .select()
            .single();

        if (error) {
            return res.status(400).json({ error: { message: error.message } });
        }

        res.status(201).json(newRelation);
    } catch (error: any) {
        console.error('Social friend request error:', error);
        res.status(500).json({ error: { message: 'Internal server error' } });
    }
});

router.patch('/friends/:requestId/accept', async (req: AuthedRequest, res) => {
    try {
        const currentUserId = req.user?.id;
        const requestId = req.params.requestId;

        if (!currentUserId) {
            return res.status(401).json({ error: { message: 'Unauthorized' } });
        }

        if (!requestId) {
            return res.status(400).json({ error: { message: 'Request ID is required' } });
        }

        // Get the friend request
        const { data: friendRequest, error: fetchError } = await supabase
            .from('friends')
            .select('*')
            .eq('id', requestId)
            .single();

        if (fetchError || !friendRequest) {
            return res.status(404).json({ error: { message: 'Friend request not found' } });
        }

        // Verify that the current user is the addressee (receiver) of the request
        if (friendRequest.addressee_id !== currentUserId) {
            return res.status(403).json({ error: { message: 'You can only accept requests sent to you' } });
        }

        // Verify that the request is still pending
        if (friendRequest.status !== 'pending') {
            return res.status(400).json({ error: { message: `Request is already ${friendRequest.status}` } });
        }

        // Update the status to accepted
        const { data: updatedRelation, error: updateError } = await supabase
            .from('friends')
            .update({ status: 'accepted', updated_at: new Date().toISOString() })
            .eq('id', requestId)
            .select(
                `id, requester_id, addressee_id, status, created_at, updated_at,
                requester:users!friends_requester_id_fkey (id, username, display_name),
                addressee:users!friends_addressee_id_fkey (id, username, display_name)`
            )
            .single();

        if (updateError) {
            return res.status(400).json({ error: { message: updateError.message } });
        }

        res.json(updatedRelation);
    } catch (error: any) {
        console.error('Social accept friend request error:', error);
        res.status(500).json({ error: { message: 'Internal server error' } });
    }
});

router.patch('/friends/:requestId/reject', async (req: AuthedRequest, res) => {
    try {
        const currentUserId = req.user?.id;
        const requestId = req.params.requestId;

        if (!currentUserId) {
            return res.status(401).json({ error: { message: 'Unauthorized' } });
        }

        if (!requestId) {
            return res.status(400).json({ error: { message: 'Request ID is required' } });
        }

        // Get the friend request
        const { data: friendRequest, error: fetchError } = await supabase
            .from('friends')
            .select('*')
            .eq('id', requestId)
            .single();

        if (fetchError || !friendRequest) {
            return res.status(404).json({ error: { message: 'Friend request not found' } });
        }

        // Verify that the current user is the addressee (receiver) of the request
        if (friendRequest.addressee_id !== currentUserId) {
            return res.status(403).json({ error: { message: 'You can only reject requests sent to you' } });
        }

        // Verify that the request is still pending
        if (friendRequest.status !== 'pending') {
            return res.status(400).json({ error: { message: `Request is already ${friendRequest.status}` } });
        }

        // Delete the friend request (reject = delete)
        const { error: deleteError } = await supabase
            .from('friends')
            .delete()
            .eq('id', requestId);

        if (deleteError) {
            return res.status(400).json({ error: { message: deleteError.message } });
        }

        res.json({ success: true, message: 'Friend request rejected' });
    } catch (error: any) {
        console.error('Social reject friend request error:', error);
        res.status(500).json({ error: { message: 'Internal server error' } });
    }
});

router.delete('/friends/:requestId', async (req: AuthedRequest, res) => {
    try {
        const currentUserId = req.user?.id;
        const requestId = req.params.requestId;

        if (!currentUserId) {
            return res.status(401).json({ error: { message: 'Unauthorized' } });
        }

        if (!requestId) {
            return res.status(400).json({ error: { message: 'Request ID is required' } });
        }

        // Get the friend request
        const { data: friendRequest, error: fetchError } = await supabase
            .from('friends')
            .select('*')
            .eq('id', requestId)
            .single();

        if (fetchError || !friendRequest) {
            return res.status(404).json({ error: { message: 'Friend request not found' } });
        }

        // Verify that the current user is the requester (sender) of the request
        if (friendRequest.requester_id !== currentUserId) {
            return res.status(403).json({ error: { message: 'You can only cancel requests you sent' } });
        }

        // Verify that the request is still pending
        if (friendRequest.status !== 'pending') {
            return res.status(400).json({ error: { message: `Cannot cancel request that is ${friendRequest.status}` } });
        }

        // Delete the friend request (cancel = delete)
        const { error: deleteError } = await supabase
            .from('friends')
            .delete()
            .eq('id', requestId);

        if (deleteError) {
            return res.status(400).json({ error: { message: deleteError.message } });
        }

        res.json({ success: true, message: 'Friend request cancelled' });
    } catch (error: any) {
        console.error('Social cancel friend request error:', error);
        res.status(500).json({ error: { message: 'Internal server error' } });
    }
});

router.get('/friends/accepted', async (req: AuthedRequest, res) => {
    try {
        const currentUserId = req.user?.id;

        if (!currentUserId) {
            return res.status(401).json({ error: { message: 'Unauthorized' } });
        }

        // Get only accepted friend relations
        const { data: relations, error } = await supabase
            .from('friends')
            .select(
                `id, requester_id, addressee_id, status, created_at, updated_at,
                requester:users!friends_requester_id_fkey (id, username, display_name, user_info( avatar_option )),
                addressee:users!friends_addressee_id_fkey (id, username, display_name, user_info( avatar_option ))`
            )
            .eq('status', 'accepted')
            .or(`requester_id.eq.${currentUserId},addressee_id.eq.${currentUserId}`)
            .order('updated_at', { ascending: false });

        if (error) {
            return res.status(400).json({ error: { message: error.message } });
        }

        res.json(relations ?? []);
    } catch (error: any) {
        console.error('Social friends fetch error:', error);
        res.status(500).json({ error: { message: 'Internal server error' } });
    }
});

export default router;
