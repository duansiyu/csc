const config = {
    development: {
        version: '1.2.2',
        versionCode: 122,
        API: 'https://beta.node.mgcheng.com',
        APPID: 'SP_BETA_CSC',
        APPKEY: 'SP_BETA_CSC',
    },
    release: {
        version: '1.2.2',
        versionCode: 122,
        API: 'https://release.node.mgcheng.com',
        APPID: 'csc_rel_si',
        APPKEY: 'csc_rel_si',
    },
    production: {

        version: '1.2.2',
        versionCode: 122,
        API: 'https://node.gzduobeibao.com',
        APPID: 'csc_prod_si',
        APPKEY: 'csc_prod_si',
    },
}

// const env = 'development'
//  const env = 'release'
const env = 'production'

const result = { ...config[env] }
export default result