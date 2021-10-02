export async function srStart() {
    $('.file-upload-content').hide();
    $('.output-content').show();

    const model = await tf.loadLayersModel("model.json");

    const t = tf.tensor4d([window.dataImage], [1, 300, 300, 3]);

    const prediction = await model.predict(t);
    const resultArray = prediction.data();
    resultArray.then(
        function (val) {
            val = Array.from(val);
            var res = new Uint8ClampedArray(360000);
            for (var i = 0; i < 300; i++) {
                for (var j = 0; j < 300; j++) {
                    var idx = i * 900 + j * 3;
                    var residx = i * 1200 + j * 4;

                    var temp = val[idx] * 255;
                    var a = (temp > 255) ? 255 : ((temp < 0) ? 0 : temp);
                    res[residx] = Math.round(a);

                    temp = val[idx + 1] * 255;
                    a = (temp > 255) ? 255 : ((temp < 0) ? 0 : temp);
                    res[residx + 1] = Math.round(a);

                    temp = val[idx + 2] * 255;
                    a = (temp > 255) ? 255 : ((temp < 0) ? 0 : temp);
                    res[residx + 2] = Math.round(a);

                    res[residx + 3] = 255;
                }
            }
            const img = new ImageData(res, 300);
            const canvas = document.getElementById("resultcanvas");
            const ctx = canvas.getContext("2d");
            ctx.putImageData(img, 0, 0);

            const pflist = 'win16|win32|win64|mac|macintel';
            canvas.toBlob(function(blob) {
                saveAs(blob, makeFileName() + '.jpg');
            }, 'image/jpeg');
            
        }
    );

}

function makeFileName() {
    let d = new Date();

    let years = make2digitsString(d.getFullYear());
    let months = make2digitsString(d.getMonth()+1);
    let date = make2digitsString(d.getDate());

    let hour = make2digitsString(d.getHours());
    let minute = make2digitsString(d.getMinutes());
    let sec = make2digitsString(d.getSeconds());

    return "SR_" + years + months + date + hour +  minute + sec;
}

function make2digitsString(source) {
    var dest = null;
    if(source < 10) {
        dest = "0" + source.toString();
    } else {
        dest = source.toString();
    }
    return dest;
}

