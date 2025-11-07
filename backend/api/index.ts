import type { VercelRequest, VercelResponse } from '@vercel/node';
import serverless from 'serverless-http';

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
            const handler = serverless(expressApp);
            
            const loadTime = Date.now() - startTime;
            console.log(`Request processed in ${loadTime}ms`);
            
            return handler(req, res);
            
        } catch (error) {
            console.error('Handler error:', error);
            
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