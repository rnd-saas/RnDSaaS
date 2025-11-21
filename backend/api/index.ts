import type { VercelRequest, VercelResponse } from '@vercel/node';

let app: any = null;
let appLoadError: Error | null = null;

async function getApp() {
    if (app) return app;
    if (appLoadError) throw appLoadError;

    try {
        const { default: expressApp } = await import('../src/app');
        app = expressApp;
        return app;
    } catch (error) {
        console.error('Failed to load Express app:', error);
        appLoadError = error as Error;
        throw error;
    }
}

const createHandler = () => {
    return async (req: VercelRequest, res: VercelResponse) => {
        try {
            const urlPath = (req.url || '').split('?')[0];

            if (urlPath === '/favicon.ico') {
                res.status(204).end();
                return;
            }

            if ((req.method === 'GET' || req.method === 'HEAD') &&
                (urlPath === '/' || urlPath === '/api' || urlPath === '/api/index')) {
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

            const expressApp = await getApp();

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

            return;
            
        } catch (error) {
            console.error('Handler error:', error);
            res.status(500).json({
                error: 'Service temporarily unavailable',
                message: 'Failed to initialize application',
                timestamp: new Date().toISOString()
            });
        }
    };
};

export default createHandler();