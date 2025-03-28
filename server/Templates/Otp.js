export const SendingOtp = (name,otp)=>{
    return `
<!DOCTYPE html>
<html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">

<head>
 <meta charset="UTF-8" />
 <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
 <!--[if !mso]><!-- -->
 <meta http-equiv="X-UA-Compatible" content="IE=edge" />
 <!--<![endif]-->
 <meta name="viewport" content="width=device-width, initial-scale=1.0" />
 <meta name="format-detection" content="telephone=no, date=no, address=no, email=no" />
 <meta name="x-apple-disable-message-reformatting" />
 <link href="https://fonts.googleapis.com/css?family=Fira+Sans:ital,wght@0,400;0,400" rel="stylesheet" />
 <title>Untitled</title>
 <!-- Made with Postcards Email Builder by Designmodo -->
 <!--[if !mso]><!-- -->
 <style>
 @font-face { font-family: 'Fira Sans'; font-style: normal; font-weight: 400; src: local('Fira Sans Regular'), local('FiraSans-Regular'), url(https://fonts.gstatic.com/s/firasans/v10/va9E4kDNxMZdWfMOD5VvmojLazX3dGTP.woff2) format('woff2'); unicode-range: U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F; }
         @font-face { font-family: 'Fira Sans'; font-style: normal; font-weight: 400; src: local('Fira Sans Regular'), local('FiraSans-Regular'), url(https://fonts.gstatic.com/s/firasans/v10/va9E4kDNxMZdWfMOD5Vvk4jLazX3dGTP.woff2) format('woff2'); unicode-range: U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116; }
         @font-face { font-family: 'Fira Sans'; font-style: normal; font-weight: 400; src: local('Fira Sans Regular'), local('FiraSans-Regular'), url(https://fonts.gstatic.com/s/firasans/v10/va9E4kDNxMZdWfMOD5VvmYjLazX3dGTP.woff2) format('woff2'); unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF; }
         @font-face { font-family: 'Fira Sans'; font-style: normal; font-weight: 400; src: local('Fira Sans Regular'), local('FiraSans-Regular'), url(https://fonts.gstatic.com/s/firasans/v10/va9E4kDNxMZdWfMOD5Vvl4jLazX3dA.woff2) format('woff2'); unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD; }
 </style>
 <!--<![endif]-->
 <style>
 html, body { margin: 0 !important; padding: 0 !important; min-height: 100% !important; width: 100% !important; -webkit-font-smoothing: antialiased; }
         * { -ms-text-size-adjust: 100%; }
         #outlook a { padding: 0; }
         .ReadMsgBody, .ExternalClass { width: 100%; }
         .ExternalClass, .ExternalClass p, .ExternalClass td, .ExternalClass div, .ExternalClass span, .ExternalClass font { line-height: 100%; }
         table, td, th { mso-table-lspace: 0 !important; mso-table-rspace: 0 !important; border-collapse: collapse; }
         u + .body table, u + .body td, u + .body th { will-change: transform; }
         body, td, th, p, div, li, a, span { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; mso-line-height-rule: exactly; }
         img { border: 0; outline: 0; line-height: 100%; text-decoration: none; -ms-interpolation-mode: bicubic; }
         a[x-apple-data-detectors] { color: inherit !important; text-decoration: none !important; }
         .body .pc-project-body { background-color: transparent !important; }
                 
 
         @media (min-width: 621px) {
             .pc-lg-hide {  display: none; } 
             .pc-lg-bg-img-hide { background-image: none !important; }
         }
 </style>
 <style>
 @media (max-width: 620px) {
 .pc-project-body {min-width: 0px !important;}
 .pc-project-container {width: 100% !important;}
 .pc-sm-hide, .pc-w620-gridCollapsed-1 > tbody > tr > .pc-sm-hide {display: none !important;}
 .pc-sm-bg-img-hide {background-image: none !important;}
 .pc-w620-font-size-12px {font-size: 12px !important;}
 .pc-w620-line-height-15px {line-height: 15px !important;}
 .pc-w620-padding-10-10-0-10 {padding: 10px 10px 0px 10px !important;}
 table.pc-w620-spacing-0-0-0-0 {margin: 0px 0px 0px 0px !important;}
 td.pc-w620-spacing-0-0-0-0,th.pc-w620-spacing-0-0-0-0{margin: 0 !important;padding: 0px 0px 0px 0px !important;}
 .pc-w620-padding-0-10-5-10 {padding: 0px 10px 5px 10px !important;}
 .pc-w620-padding-5-10-80-10 {padding: 5px 10px 80px 10px !important;}
 
 .pc-w620-gridCollapsed-1 > tbody,.pc-w620-gridCollapsed-1 > tbody > tr,.pc-w620-gridCollapsed-1 > tr {display: inline-block !important;}
 .pc-w620-gridCollapsed-1.pc-width-fill > tbody,.pc-w620-gridCollapsed-1.pc-width-fill > tbody > tr,.pc-w620-gridCollapsed-1.pc-width-fill > tr {width: 100% !important;}
 .pc-w620-gridCollapsed-1.pc-w620-width-fill > tbody,.pc-w620-gridCollapsed-1.pc-w620-width-fill > tbody > tr,.pc-w620-gridCollapsed-1.pc-w620-width-fill > tr {width: 100% !important;}
 .pc-w620-gridCollapsed-1 > tbody > tr > td,.pc-w620-gridCollapsed-1 > tr > td {display: block !important;width: auto !important;padding-left: 0 !important;padding-right: 0 !important;margin-left: 0 !important;}
 .pc-w620-gridCollapsed-1.pc-width-fill > tbody > tr > td,.pc-w620-gridCollapsed-1.pc-width-fill > tr > td {width: 100% !important;}
 .pc-w620-gridCollapsed-1.pc-w620-width-fill > tbody > tr > td,.pc-w620-gridCollapsed-1.pc-w620-width-fill > tr > td {width: 100% !important;}
 .pc-w620-gridCollapsed-1 > tbody > .pc-grid-tr-first > .pc-grid-td-first,.pc-w620-gridCollapsed-1 > .pc-grid-tr-first > .pc-grid-td-first {padding-top: 0 !important;}
 .pc-w620-gridCollapsed-1 > tbody > .pc-grid-tr-last > .pc-grid-td-last,.pc-w620-gridCollapsed-1 > .pc-grid-tr-last > .pc-grid-td-last {padding-bottom: 0 !important;}
 
 .pc-w620-gridCollapsed-0 > tbody > .pc-grid-tr-first > td,.pc-w620-gridCollapsed-0 > .pc-grid-tr-first > td {padding-top: 0 !important;}
 .pc-w620-gridCollapsed-0 > tbody > .pc-grid-tr-last > td,.pc-w620-gridCollapsed-0 > .pc-grid-tr-last > td {padding-bottom: 0 !important;}
 .pc-w620-gridCollapsed-0 > tbody > tr > .pc-grid-td-first,.pc-w620-gridCollapsed-0 > tr > .pc-grid-td-first {padding-left: 0 !important;}
 .pc-w620-gridCollapsed-0 > tbody > tr > .pc-grid-td-last,.pc-w620-gridCollapsed-0 > tr > .pc-grid-td-last {padding-right: 0 !important;}
 
 .pc-w620-tableCollapsed-1 > tbody,.pc-w620-tableCollapsed-1 > tbody > tr,.pc-w620-tableCollapsed-1 > tr {display: block !important;}
 .pc-w620-tableCollapsed-1.pc-width-fill > tbody,.pc-w620-tableCollapsed-1.pc-width-fill > tbody > tr,.pc-w620-tableCollapsed-1.pc-width-fill > tr {width: 100% !important;}
 .pc-w620-tableCollapsed-1.pc-w620-width-fill > tbody,.pc-w620-tableCollapsed-1.pc-w620-width-fill > tbody > tr,.pc-w620-tableCollapsed-1.pc-w620-width-fill > tr {width: 100% !important;}
 .pc-w620-tableCollapsed-1 > tbody > tr > td,.pc-w620-tableCollapsed-1 > tr > td {display: block !important;width: auto !important;}
 .pc-w620-tableCollapsed-1.pc-width-fill > tbody > tr > td,.pc-w620-tableCollapsed-1.pc-width-fill > tr > td {width: 100% !important;box-sizing: border-box !important;}
 .pc-w620-tableCollapsed-1.pc-w620-width-fill > tbody > tr > td,.pc-w620-tableCollapsed-1.pc-w620-width-fill > tr > td {width: 100% !important;box-sizing: border-box !important;}
 }
 </style>
 <!--[if !mso]><!-- -->
 <style>
 @font-face { font-family: 'Fira Sans'; font-style: normal; font-weight: 400; src: url('https://fonts.gstatic.com/s/firasans/v17/va9E4kDNxMZdWfMOD5VvmYjN.woff') format('woff'), url('https://fonts.gstatic.com/s/firasans/v17/va9E4kDNxMZdWfMOD5VvmYjL.woff2') format('woff2'); }
 </style>
 <!--<![endif]-->
 <!--[if mso]>
    <style type="text/css">
        .pc-font-alt {
            font-family: Arial, Helvetica, sans-serif !important;
        }
    </style>
    <![endif]-->
 <!--[if gte mso 9]>
    <xml>
        <o:OfficeDocumentSettings>
            <o:AllowPNG/>
            <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
    </xml>
    <![endif]-->
</head>

<body class="body pc-font-alt" style="width: 100% !important; min-height: 100% !important; margin: 0 !important; padding: 0 !important; font-weight: normal; color: #2D3A41; mso-line-height-rule: exactly; -webkit-font-smoothing: antialiased; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; font-variant-ligatures: normal; text-rendering: optimizeLegibility; -moz-osx-font-smoothing: grayscale; background-color: #f4f4f4;" bgcolor="#f4f4f4">
 <table class="pc-project-body" style="table-layout: fixed; width: 100%; min-width: 600px; background-color: #f4f4f4;" bgcolor="#f4f4f4" border="0" cellspacing="0" cellpadding="0" role="presentation">
  <tr>
   <td align="center" valign="top" style="width:auto;">
    <table class="pc-project-container" align="center" style="width: 600px; max-width: 600px;" border="0" cellpadding="0" cellspacing="0" role="presentation">
     <tr>
      <td style="padding: 20px 0px 20px 0px;" align="left" valign="top">
       <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
        <tr>
         <td valign="top">
          <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
           <tr>
            <td class="pc-w620-spacing-0-0-0-0" width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
             <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
              <tr>
               <td valign="top" class="pc-w620-padding-10-10-0-10" style="padding: 40px 40px 40px 40px; height: unset; background-color: #ffffff;" bgcolor="#ffffff">
                <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                 <tr>
                  <td align="left" valign="top" style="padding: 0px 0px 20px 0px;">
                   <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
                    <tr>
                     <td valign="top" align="left">
                      <div class="pc-font-alt" style="text-decoration: none;">
                       <div style="font-size: 12px;line-height: 15px;text-align:left;text-align-last:left;color:#9b9b9b;font-style:normal;font-weight:400;letter-spacing:-0.2px;">
                        <div><span style="font-family: 'Fira Sans', Arial, Helvetica, sans-serif; font-size: 18px; line-height: 28px;" class="pc-w620-font-size-12px pc-w620-line-height-15px">Dear Valued Customer, ${name}</span>
                        </div>
                        <div><span style="font-family: 'Fira Sans', Arial, Helvetica, sans-serif; font-size: 18px; line-height: 28px;" class="pc-w620-font-size-12px pc-w620-line-height-15px">We are committed to ensuring the security of your transactions with BDO Bank. As part of our security measures, a One-Time Password (OTP) has been sent to your registered contact information. This OTP is a crucial step in verifying your identity and safeguarding your account.</span>
                        </div>
                        <div><span style="font-family: 'Fira Sans', Arial, Helvetica, sans-serif; font-size: 18px; line-height: 28px;" class="pc-w620-font-size-12px pc-w620-line-height-15px">Please use this ${otp} to complete your Account verification. Remember, the OTP is valid for only 10 minutes, so we encourage you to act promptly. If you did not request this OTP, please contact BDO Bank support immediately to ensure the safety of your account.</span>
                        </div>
                        <div><span style="font-family: 'Fira Sans', Arial, Helvetica, sans-serif; font-size: 18px; line-height: 28px;" class="pc-w620-font-size-12px pc-w620-line-height-15px">Thank you for trusting BDO Bank with your financial needs.</span>
                        </div>
                       </div>
                      </div>
                     </td>
                    </tr>
                   </table>
                  </td>
                 </tr>
                </table>
               </td>
              </tr>
             </table>
            </td>
           </tr>
          </table>
         </td>
        </tr>
        <tr>
         <td valign="top">
          <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
           <tr>
            <td class="pc-w620-spacing-0-0-0-0" width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
             <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
              <tr>
               <td valign="top" class="pc-w620-padding-0-10-5-10" style="padding: 40px 40px 40px 40px; height: unset; background-color: #ffffff;" bgcolor="#ffffff">
                <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
                 <tr>
                  <td valign="top" align="left">
                   <div class="pc-font-alt" style="text-decoration: none;">
                    <div style="font-size: 12px;line-height: 15px;text-align:left;text-align-last:left;color:#9b9b9b;font-style:normal;font-weight:400;letter-spacing:-0.2px;">
                     <div><span style="font-family: 'Fira Sans', Arial, Helvetica, sans-serif; font-size: 18px; line-height: 28px;" class="pc-w620-font-size-12px pc-w620-line-height-15px">To ensure the security of your transaction, please follow these instructions for using your One-Time Password (OTP):</span>
                     </div>
                     <div><span style="font-family: 'Fira Sans', Arial, Helvetica, sans-serif; font-size: 18px; line-height: 28px;" class="pc-w620-font-size-12px pc-w620-line-height-15px">1. Upon receiving the OTP, enter it in the designated field on the transaction page. This step is crucial for verifying your identity and authorizing the transaction.</span>
                     </div>
                     <div><span style="font-family: 'Fira Sans', Arial, Helvetica, sans-serif; font-size: 18px; line-height: 28px;" class="pc-w620-font-size-12px pc-w620-line-height-15px">2. Please be aware that the OTP is valid for only 10 minutes from the time of receipt. Ensure you complete the transaction within this timeframe to avoid any interruptions.</span>
                     </div>
                     <div><span style="font-family: 'Fira Sans', Arial, Helvetica, sans-serif; font-size: 18px; line-height: 28px;" class="pc-w620-font-size-12px pc-w620-line-height-15px">3. If you encounter any issues or if the OTP expires, you may request a new one by following the prompts on the transaction page.</span>
                     </div>
                     <div><span style="font-family: 'Fira Sans', Arial, Helvetica, sans-serif; font-size: 18px; line-height: 28px;" class="pc-w620-font-size-12px pc-w620-line-height-15px">We appreciate your cooperation in maintaining the security of your account. Should you have any questions or require assistance, please do not hesitate to contact BDO Bank support.</span>
                     </div>
                    </div>
                   </div>
                  </td>
                 </tr>
                </table>
               </td>
              </tr>
             </table>
            </td>
           </tr>
          </table>
         </td>
        </tr>
        <tr>
         <td valign="top">
          <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
           <tr>
            <td class="pc-w620-spacing-0-0-0-0" width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
             <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
              <tr>
               <td valign="top" class="pc-w620-padding-5-10-80-10" style="padding: 40px 40px 40px 40px; height: unset; background-color: #ffffff;" bgcolor="#ffffff">
                <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
                 <tr>
                  <td valign="top" align="left">
                   <div class="pc-font-alt" style="text-decoration: none;">
                    <div style="font-size: 12px;line-height: 15px;text-align:left;text-align-last:left;color:#9b9b9b;font-style:normal;font-weight:400;letter-spacing:-0.2px;">
                     <div><span style="font-family: 'Fira Sans', Arial, Helvetica, sans-serif; font-size: 18px; line-height: 28px;" class="pc-w620-line-height-15px pc-w620-font-size-12px">Be smarter than a scammer with #BDOStopScam -Do not share your username,password,OTP, and card details (card number, expiry date, and CVV). -Do not click links.BDO will NEVER send links via email,SMS, and Viber. -Do not reply to suspicious senders. Visit the BDO website and search ro "BDOStopScam" to view all official BDO sender names.</span>
                     </div>
                     <div>
                      <br><span style="font-family: 'Fira Sans', Arial, Helvetica, sans-serif; font-size: 18px; line-height: 28px;" class="pc-w620-line-height-15px pc-w620-font-size-12px">Please so not reply to this email as it not authorized to accept messages. If you have any questions,contact us through the following: Metro Manila: (+632) 8888-0000 International Toll-Free Numbers: IAC +800-8- CALLBDO (2255-236)</span>
                     </div>
                    </div>
                   </div>
                  </td>
                 </tr>
                </table>
               </td>
              </tr>
             </table>
            </td>
           </tr>
          </table>
         </td>
        </tr>
        <tr>
         <td>
          <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
           <tr>
            <td align="center" valign="top" style="padding-top: 20px; padding-bottom: 20px; vertical-align: top;">
             <a href="https://postcards.email/?uid=Mjk3NjYx&type=footer" target="_blank" style="text-decoration: none; overflow: hidden; border-radius: 2px; display: inline-block;">
              <img src="images/promo-footer-dark.jpg" width="198" height="46" alt="Made with (o -) postcards" style="width: 198px; height: auto; margin: 0 auto; border: 0; outline: 0; line-height: 100%; -ms-interpolation-mode: bicubic; vertical-align: top;">
             </a>
             <img src="https://api-postcards.designmodo.com/tracking/mail/promo?uid=Mjk3NjYx" width="1" height="1" alt="" style="display:none; width: 1px; height: 1px;">
            </td>
           </tr>
          </table>
         </td>
        </tr>
       </table>
      </td>
     </tr>
    </table>
   </td>
  </tr>
 </table>
</body>

</html>
    
    `
}