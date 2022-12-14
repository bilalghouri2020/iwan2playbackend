// const ERROR = require("../api/helpers/errorHandler");
const { isBuffer } = require("lodash");
const authHelper = require("../Api/helpers/authHelper");
// const { ErrorHandler } = require("../api/helpers/errorHandler");
const { existingUserByEmail } = require("../Api/helpers/userHelper");
const {
  jwtVerify,
} = authHelper;



const closeRoutesController = {
  verifyUser: async (req, res, next) => {
    
    try {
      // return 
      const authHeader = req.headers["authorization"];
      const token = authHeader && authHeader.split(" ")[1];
      if (!token) {
        res.json({
          statusCode: 401,
          error: 'Unauthorized To Access'
        })
        return
        // throw new ErrorHandler(401, 'Unauthorized To Access')
      }
      const decodedData = await jwtVerify(token);
      const user = await existingUserByEmail(decodedData.email);
      // if(user.GoogleId ==){
      if (!user) {
        return res.json({
          error: 'tokan valid but user does\'t exist.'
        })
      }

      if (decodedData?.googleId) {
        if (user.GoogleId !== decodedData?.googleId) {
          return res.json({
            error: 'tokan is valid but google account does\'t exist or google ID does\'t match.'
          })
        }

      }

      req.body.userId = user._id
      
      next();
      return
    } catch (error) {
      console.log('catch error from varify token middleware...', error);
      return res.json({
        message: 'catch error from varify middle',
        error
      })
    }
  },
  verifyUser_old: async (req, res, next) => {
    try {
      const { authenticationType } = req.body

      // return 
      if (Number(authenticationType) === 0) {
        const authHeader = req.headers["authorization"];
        console.log(authHeader)
        const token = authHeader && authHeader.split(" ")[1];
        if (!token) {
          res.json({
            statusCode: 401,
            error: 'Unauthorized To Access'
          })
          return
        }
        const decodedData = await jwtVerify(token);
        const user = await existingUserByEmail(decodedData.email);
        req.body.userId = user._id   
        next();
        return
      } else if (Number(authenticationType) === 1) {
        const { validateAuthData: { googleId, email } } = req.body
        const user = await existingUserByEmail(email);
        // console.log(user._id);
        // return 
        try {
          if (!user) throw 'user not exist...';
          if (!user?.isGoogle) throw 'this user is nothing exist as a Google user...';
          if (googleId !== user?.GoogleId) throw "Google ID isn't matched";
          req.body.userId = user._id
       
          // return 
          next()
          return
        } catch (error) {
          console.log('error...', error);
          res.json({
            error
          })
          return
        }
        // if (!user) {
        //   res.json({
        //     error: 'user not exist...'
        //   })
        //   return
        // }
        // if(authenticationType === )
      }
      console.log('something went wrong from varifyUser middleware...');
      res.json({ error: 'something went wrong from varifyUser middleware...' })
      return
    } catch (error) {
      res.json({ error })
      // next(error);
      return
    }
  }
}


module.exports = closeRoutesController;