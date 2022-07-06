const Koa = require('koa2')
const app = new Koa()
const Router = require("koa-router");
const router = new Router();
const bodyParser = require('koa-bodyparser')
// 引入koa2-cors中间件
const cors = require("koa2-cors");
const Core = require('@alicloud/pop-core');
app.use(cors());
app.use(bodyParser())
// 调用router中间件
app.use(router.routes(), router.allowedMethods());
// 随机验证码
function ran(num) {
    let code = "";
    for (let i = 0; i < num; i++) {
        let radom = Math.floor(Math.random() * 10);
        code += radom
    }
    return {
        "code": code
    }
}
router.post('/note', async (ctx, next) => {
    const toPhone = ctx.request.body.phone;
    var client = new Core({
        accessKeyId: '<your-access-key-id>',
        accessKeySecret:  '<your-access-key-secret>',
        // securityToken: '<your-sts-token>', // use STS Token
        endpoint: 'https://dysmsapi.aliyuncs.com',
        apiVersion: '2017-05-25'
    });
    const randCode = ran(6);
    //   console.log('randCode', randCode)
    var params = {
        "PhoneNumbers": toPhone,
        "SignName": "海海呐提醒您",
        "TemplateCode": "您的TemplateCode",
        "TemplateParam": JSON.stringify(randCode)
    }

    var requestOption = {
        method: 'POST',
        formatParams: false,

    };
    try {
        const response = await client.request('SendSms', params, requestOption)
        console.log('response', response)
        if (response.Code === 'OK') {
            ctx.body = {
                code: '200',
                message: '发送成功'
            }
        } else {
            ctx.body = {
                code: '400',
                message: '发送失败'
            }
        }

    } catch (error) {
        console.log('error', error)
    }

})
app.listen(3001, () => {
    console.log('http://localhost:3001')
})