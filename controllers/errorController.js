import path from 'path';

export const get404 = (req, res) => {
    const filePath = path.resolve('public', 'html', '404.html');

    res.status(404).sendFile(filePath, (err) => {
        if (err) {
            res.status(404).json({
                status: 'fail',
                message: `No se encontró ${req.originalUrl}`
            });
        }
    });
};