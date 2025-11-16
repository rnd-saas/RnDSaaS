import type { VercelRequest, VercelResponse } from '@vercel/node';

// 延迟加载 Express 应用，避免冷启动时的阻塞
let app: any = null;
let appLoadError: Error | null = null;

async function getApp() {
    if (app) return app;
    if (appLoadError) throw appLoadError;

    try {
        console.log('Loading Express app...');
        const startTime = Date.now();
        
        // 动态导入，避免阻塞
        const { default: expressApp } = await import('../src/app');
        app = expressApp;
        
        const loadTime = Date.now() - startTime;
        console.log(`Express app loaded successfully in ${loadTime}ms`);
        
        return app;
    } catch (error) {
        console.error('Failed to load Express app:', error);
        appLoadError = error as Error;
        throw error;
    }
}

// 创建 serverless handler，但添加超时保护
const createHandler = () => {
    return async (req: VercelRequest, res: VercelResponse) => {
        const startTime = Date.now();
        const requestId =
            (req.headers['x-vercel-id'] as string) ||
            (req.headers['x-request-id'] as string) ||
            `${Date.now()}-${Math.random().toString(16).slice(2)}`;
        
        try {
            const urlPath = (req.url || '').split('?')[0];
            console.log('[api:index] request start', {
                requestId,
                method: req.method,
                path: urlPath,
                region: process.env.VERCEL_REGION,
                nodeEnv: process.env.NODE_ENV,
                hasSupabaseUrl: !!process.env.SUPABASE_URL,
                hasSupabaseKey: !!(process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY)
            });

            if (urlPath === '/favicon.ico') {
                console.log('[api:index] favicon request bypassed', { requestId });
                res.status(204).end();
                return;
            }

            if ((req.method === 'GET' || req.method === 'HEAD') &&
                (urlPath === '/' || urlPath === '/api' || urlPath === '/api/index')) {
                console.log('[api:index] health request handled directly', { requestId, method: req.method, path: urlPath });
                const payload = {
                    message: 'Backend is running!',
                    version: '1.0.0',
                    timestamp: new Date().toISOString()
                };

                if (req.method === 'HEAD') {
                    res.status(200).end();
                } else {
                    res.status(200).json(payload);
                }
                return;
            }

            console.log('[api:index] loading express app', { requestId });
            const expressApp = await getApp();

            console.log('[api:index] forwarding to express handler', { requestId });
            const handlerStart = Date.now();
            await new Promise<void>((resolve, reject) => {
                const cleanup = () => {
                    res.off('finish', onFinish);
                    res.off('close', onClose);
                    res.off('error', onError);
                };

                const onFinish = () => {
                    cleanup();
                    resolve();
                };
                const onClose = () => {
                    cleanup();
                    resolve();
                };
                const onError = (err: Error) => {
                    cleanup();
                    reject(err);
                };

                res.on('finish', onFinish);
                res.on('close', onClose);
                res.on('error', onError);

                try {
                    expressApp(req, res);
                } catch (err) {
                    cleanup();
                    reject(err as Error);
                }
            });

            console.log('[api:index] handler completed', {
                requestId,
                durationMs: Date.now() - handlerStart,
                totalMs: Date.now() - startTime
            });
            return;
            
        } catch (error) {
            console.error('[api:index] handler error', { requestId, error });
            
            // 如果应用加载失败，返回降级响应
            res.status(500).json({
                error: 'Service temporarily unavailable',
                message: 'Failed to initialize application',
                timestamp: new Date().toISOString()
            });
        }
    };
};

export default createHandler();