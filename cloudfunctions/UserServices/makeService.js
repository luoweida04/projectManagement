const log = async (wxContext, event, result) => {
  await db.collection('logs').add({
    data: {
      datetime: new Date(),
      wxContext,
      event,
      result
    }
  })
}
/**
 * 
 * @param {cloud} cloud 
 * @param {Map<string,(params) => any>} methods 
 */
exports.make = (cloud, methods) => {
  return async (event, context) => {
    const db = cloud.database()
    const wxContext = cloud.getWXContext();
    const { action, params } = event;
    if (Object.keys(methods).indexOf(action) == -1) {
      return {
        ok: false,
        msg: `action '${action}' is not found, Supported actions are [${Object.keys(methods)}]`
      }
    }
    try {
      const result = await methods[action](params || {})
      await db.collection('logs').add({
        data: {
          datetime: new Date(),
          wxContext,
          event,
          result,
          action: event.action,
          APPID: wxContext.APPID,
          OPENID: wxContext.OPENID,
          IP: wxContext.CLIENTIP,
          IPV6: wxContext.CLIENTIPV6,
          ENV: wxContext.ENV,
        }
      })
      return {
        ok: true,
        data: result
      }
    } catch (error) {
      await db.collection('logs').add({
        data: {
          datetime: new Date(),
          wxContext,
          event,
          error: error.message
        }
      })
      return {
        ok: false,
        msg: error.message
      }
    }
  }
}