
// import fetch from 'node-fetch';
// var notification = {
//     "title": "ttttestttttttt",
//     "body": "tcctttestttttttttttt"
// }

// var fcm_tokens = ["ewbC4gpJQse6U2MvRn0DJ6:APA91bEmr3qM55pkp28fNjcLPq_cSaVcqcjiHpV8oy-s-eiFPC_f0aZpOULJGK_LId6sVfNxNLnx9-STy8xMKgXPOyEiWOjSVA5mZdHQuqhOrJ5WR1kXtmkBGj4yunFF-qj6xYOmXgMg"]

// var notification_body = {
//     "notification": notification,
//     "to": "e42h1iTmRwGlyuwn9nGqu4:APA91bF4jLBFEK1TNgItzgtK3JrteZmNxr6YIiDeQphlWboVbUGNE-C_sCXq89GxkjFwd-IoM0l7Nt_3FMQPbtGgS3q5mQcx1AWxnruu_I9jGSIL2l1E_maSZ58OJSCWT9ZnnnYfxpgs"
// }
// fetch("https://fcm.googleapis.com/fcm/send", { "method": "POST", "headers": { "authorization": "keys=" + "AAAABsq8jZc:APA91bG99gTYMmsMI_vlIJhjAxU6ta8j24v4dg-tInV4dKDUXqBzx3ORj_n0aI5k7opUvuyKI0nGhulfolpJgSFf2d5rnMfrN5CGA2fkpbCqTIlaidCChdDa5Gs7ymScojbL5pC93B54", "Content-Type": "application/json" }, "body": notification_body }).then((res) => {
//     // console.log(res.data)
//     console.log("notification send successfully")
// }).catch((err) => { console.log(err) })





// import FCM from 'fcm-node';
// var FCM = require('fcm-node');
// var serverKey = 'AAAABsq8jZc:APA91bG99gTYMmsMI_vlIJhjAxU6ta8j24v4dg-tInV4dKDUXqBzx3ORj_n0aI5k7opUvuyKI0nGhulfolpJgSFf2d5rnMfrN5CGA2fkpbCqTIlaidCChdDa5Gs7ymScojbL5pC93B54';
// var fcm = new FCM(serverKey);

// var message = {
//     to: "ewbC4gpJQse6U2MvRn0DJ6:APA91bEwBlIZiVYXf88rdjXHiYi0aursNA5iaKggDCqvJjk4jq2w6qX1Af_wtdRvKL1kzUUMU_XVhw25H0wPACCFNVrjY005th5-M1WHShuhpaxOJqW3lAR6AJKQsnrv9-QfyYfgoOjU",
//     notification: {
//         title: 'NotifcatioTestAPP',
//         body: '{"Message from node js app"}',
//     },

//     data: { //you can send only notification or only data(or include both)
//         title: 'ok cdfsdsdfsd',
//         body: '{"name" : "okg ooggle ogrlrl","product_id" : "123","final_price" : "0.00035"}'
//     }

// };

// fcm.send(message, function (err, response) {
//     if (err) {
//         console.log("Something has gone wrong!" + err);
//         console.log("Respponse:! " + response);
//     } else {
//         // showToast("Successfully sent with response");
//         console.log("Successfully sent with response: ", response);
//     }

// });



// successfully working  -------------------------------------------------------------------------
var FCM = require('fcm-node');
var serverKey = 'AAAABsq8jZc:APA91bG99gTYMmsMI_vlIJhjAxU6ta8j24v4dg-tInV4dKDUXqBzx3ORj_n0aI5k7opUvuyKI0nGhulfolpJgSFf2d5rnMfrN5CGA2fkpbCqTIlaidCChdDa5Gs7ymScojbL5pC93B54';
var fcm = new FCM(serverKey);

var message = {
    to: "e42h1iTmRwGlyuwn9nGqu4:APA91bF4jLBFEK1TNgItzgtK3JrteZmNxr6YIiDeQphlWboVbUGNE-C_sCXq89GxkjFwd-IoM0l7Nt_3FMQPbtGgS3q5mQcx1AWxnruu_I9jGSIL2l1E_maSZ58OJSCWT9ZnnnYfxpgs",
    notification: {
        title: 'NotifcatioTestAPP',
        body: '{"Message from node js app"}',
    },

    data: { //you can send only notification or only data(or include both)
        title: 'ok cdfsdsdfsd',
        body: '{"name" : "okg ooggle ogrlrl","product_id" : "123","final_price" : "0.00035"}'
    }

};

fcm.send(message, function (err, response) {
    if (err) {
        console.log("Something has gone wrong!" + err);
        console.log("Respponse:! " + response);
    } else {
        // showToast("Successfully sent with response");
        console.log("Successfully sent with response: ", response);
    }

});