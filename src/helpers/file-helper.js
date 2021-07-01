import _ from 'lodash';

export const processZip = (blob) => {
    
}

export const getHeader = (blob) => {
    const fileReader = new FileReader();
    fileReader.readAsArrayBuffer(blob);
    
    let header = "";
    
    fileReader.onloadend = function(e){
        let uint = new Uint8Array(e.target.result).subarray(0, 4);

        for(let i = 0; i < uint.length; i++){
            console.log(uint[i])
            if(uint[i] > 9){
                header += uint[i].toString(16)
            } else{
                header += "0".concat(uint[i].toString(16))
            }
        }
    }

    return header;
}

export const validateMime = (newFiles) => {

    let responseFiles = {
        accepted: [],
        rejected: [],
        results: []
    };

    _.forEach(newFiles, (blob) => {

        let header = getHeader(blob);
        
        switch(header){
            case "ffd8ffdb":
            case "ffd8ffe0":
            case "89504e47": // jpg, jpeg, png
                responseFiles.accepted.push(blob)
                break
            case "504b0304":
            case "52617221":
                // responseFiles = processZip(responseFiles, blob, header);
                break
            default:
                responseFiles.rejected.push(blob.name);
                break
        }
    });

    return responseFiles;
}

export default {validateMime, getHeader};