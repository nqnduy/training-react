export default class FileUtils {
    static getExtensionVideo(file) {
        var extension = '';

        if (file.type.indexOf('quicktime') >= 0) extension = '.mov';
        else if (file.type.indexOf('avi') >= 0) extension = '.avi';
        else if (file.type.indexOf('mpeg') >= 0) extension = '.mpg';
        else if (file.type.indexOf('wmv') >= 0) extension = '.wmv';
        else if (file.type.indexOf('ogg') >= 0) extension = '.ogg';
        else if (file.type.indexOf('webm') >= 0) extension = '.webm';
        else if (file.type.indexOf('mpeg-4') >= 0) extension = '.mp4';
        else if (file.type.indexOf('mp4') >= 0) extension = '.mp4';

        return extension;
    }
}
