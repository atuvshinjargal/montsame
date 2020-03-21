<?php
class Model_MyPayPal
{
    function PPHttpPost ($methodName_, $nvpStr_, $PayPalApiUsername, 
    $PayPalApiPassword, $PayPalApiSignature, $PayPalMode)
    {
        // Өөрийн API-н тохиргоог encode хийх.
        $API_UserName = urlencode($PayPalApiUsername);
        $API_Password = urlencode($PayPalApiPassword);
        $API_Signature = urlencode($PayPalApiSignature);
        if ($PayPalMode == 'sandbox') {
            $paypalmode = '.sandbox';
        } else {
            $paypalmode = '';
        }
        $API_Endpoint = "https://api-3t" . $paypalmode . ".paypal.com/nvp";
        $version = urlencode('76.0');
        // Curl-н параметрүүдийг тохируулах.
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $API_Endpoint);
        curl_setopt($ch, CURLOPT_VERBOSE, 1);
        // Server-н давхар хяналтыг хаах.
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, FALSE);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_POST, 1);
        // API-н тохиргоог өөрийн api паспорт болон гарын үсгээр тохируулах.
        $nvpreq = "METHOD=$methodName_&VERSION=$version&PWD=$API_Password&USER=$API_UserName&SIGNATURE=$API_Signature$nvpStr_";
        // Сurl-н POST FIELD- хүсэлтийг тохируулах.
        curl_setopt($ch, CURLOPT_POSTFIELDS, $nvpreq);
        // Server-с хариу авах.
        $httpResponse = curl_exec($ch);
        if (! $httpResponse) {
            exit(
            "$methodName_ failed: " . curl_error($ch) . '(' . curl_errno($ch) .
             ')');
        }
        // Хүсэлтийн хариуг задлах.
        $httpResponseAr = explode("&", $httpResponse);
        $httpParsedResponseAr = array();
        foreach ($httpResponseAr as $i => $value) {
            $tmpAr = explode("=", $value);
            if (sizeof($tmpAr) > 1) {
                $httpParsedResponseAr[$tmpAr[0]] = $tmpAr[1];
            }
        }
        if ((0 == sizeof($httpParsedResponseAr)) ||
         ! array_key_exists('ACK', $httpParsedResponseAr)) {
            exit(
            "Invalid HTTP Response for POST request($nvpreq) to $API_Endpoint.");
        }
        return $httpParsedResponseAr;
    }
}
?>