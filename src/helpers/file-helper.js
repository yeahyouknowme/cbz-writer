import _ from 'lodash';

export const processZip = (blob) => {
    
}

export const getHeader = (blob) => {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        let header = "";
        
        fileReader.onloadend = function(e){
            let uint = new Uint8Array(e.target.result).subarray(0, 4);

            for(let i = 0; i < uint.length; i++){
                if(uint[i] > 9){
                    header += uint[i].toString(16)
                } else{
                    header += "0".concat(uint[i].toString(16))
                }
            }

            resolve(header);
        }

        fileReader.onerror = reject;

        fileReader.readAsArrayBuffer(blob);
    })

}

export const validateMime = (newFiles) => {

    return new Promise((resolve, reject) => {
        let responseFiles = {
            accepted: [],
            rejected: [],
            results: []
        };

        _.forEach(newFiles, (blob) => {

            getHeader(blob)
            .then(header => {
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
            })
            
        });

        resolve(responseFiles);
    }) 

}

export default {validateMime, getHeader};