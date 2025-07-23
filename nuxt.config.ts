export default defineNuxtConfig({
    ssr: true,
    vite: {
        build: {
            minify: false, // minimize işlemini kapatıp RAM kullanımını azaltır
            terserOptions: {
                compress: false,
                mangle: false
            }
        }
    },
    nitro: {
        serveStatic: true,
        preset: 'node-server',
        compressPublicAssets: false, // public dosyaların ekstra sıkıştırmasını kapatır
    },
    app: {
        head: {
            title: 'Toger',
            htmlAttrs: {
                lang: 'tr'
            },
            meta: [
                { charset: 'utf-8' },
                { name: 'viewport', content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no' },
                { name: 'description', content: 'Toger' },
                { name: 'author', content: 'toger.copm' },
                { name: 'theme-color', content: '#0d6efd' },
                { property: 'og:title', content: 'Toger' },
                { property: 'og:description', content: 'Toger' },
                { property: 'og:type', content: 'website' },
                { property: 'og:url', content: 'https://toger.com' },
                { property: 'og:image', content: 'https://toger.com/logo.png' }
            ],
            link: [
            ],
            script: [
                {
                    src: '/js/bootstrap.bundle.min.js',
                    defer: true
                }
            ]
        }
    },
    modules: ['@pinia/nuxt'],
    pages: true,
    devtools: { enabled: true },

    css: [
        '@fortawesome/fontawesome-free/css/all.min.css',
        '@/assets/css/main.css',
        '@/assets/css/bootstrap.css',
        '@/assets/css/theme.css'
    ]
});