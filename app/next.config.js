
module.exports = {
    async rewrites (){
        console.log('rewriting');
        return [
            {
                source: '/api/:path*',
                destination: 'http://localhost:3030/:path*'
            }
        ]
    }
}