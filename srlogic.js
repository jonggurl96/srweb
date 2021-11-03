export async function srStart() {
    $('.file-upload-content').hide();
    $('.output-content').show();

    const canvas = document.getElementById("resultcanvas");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, 300, 300);

    const model = await tf.loadLayersModel("model/model.json");

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
            ctx.putImageData(img, 0, 0);
        }
    );

}
