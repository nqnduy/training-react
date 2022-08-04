const Validation = {
    imageValidate(file) {
        // ("imageValidate")
        var maxSize = 10;
        var fileSize = 1024 * 1024 * maxSize; // 10mb
        var fileTypes = ['image/png', 'image/jpeg'];
        // var isFileValid = true;
        if (!file || fileTypes.indexOf(file.type) < 0) {
            alert('Vui lòng upload ảnh đúng định dạng jpg hay png');
            return false;
        } else if (file.size > fileSize) {
            alert('Vui lòng upload ảnh có dung lượng thấp hơn ' + maxSize + 'mb');
            return false;
        }
        return true;
    },

    videoValidate(file) {
        // ("videoValidate")

        var maxSize = 15;
        var fileSize = 1024 * 1024 * maxSize; // 10mb
        var fileTypes = 'video';
        // (file.type)
        // var isFileValid = true;
        if (!file || file.type.indexOf(fileTypes) < 0) {
            alert('Vui lòng upload video');
            return false;
        } else if (file.size > fileSize) {
            alert('Vui lòng upload video có dung lượng thấp hơn ' + maxSize + 'mb');
            return false;
        }
        return true;
    },
};

export default Validation;
