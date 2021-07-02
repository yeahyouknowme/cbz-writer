import { useState } from 'react';
import { saveAs } from 'file-saver';
import JSZip, { file } from 'jszip';
import {validateMime} from './helpers/file-helper';
import ImagePreview from './components/image-preview';
import './App.scss'
import _ from 'lodash';

function App() {

    const [dragID, setDragID] = useState();
    const [collectionName, setCollectionName] = useState('');
    const [files, setFiles] = useState([]);
    const [images, setImages] = useState([]);


    const processZip = (fileObj, compressed, header) => {
        let responseFiles = fileObj;

        const fileReader = new FileReader();
        fileReader.readAsArrayBuffer(compressed);

        fileReader.onloadend = function(e){
        }

        return responseFiles;
    }


    const onFileDownload = (e) => {
        e.preventDefault();

        const zip = new JSZip();

        for (let i = 0; i < files.length; i++) {
        zip.file(i + ".png", files[i].file);
        }

        zip.generateAsync({ type: "blob" })
        .then(function (blob) {
            saveAs(blob, collectionName + ".cbz");
        });
    };

    const onFileChange = (e) => {

        validateMime(e.target.files)
        .then(newFiles => {
          console.log('Accepted: ', newFiles.accepted)
          if(newFiles.rejected.length > 0){
            console.info('Rejected: ', newFiles.rejected, ' | Only image files are allowed.');
          }

          let orderCounter = 1;

          let lastIdx = _.findLastIndex(newFiles, function(file) { return file.order > 0 });

          if(lastIdx > -1){
              orderCounter = orderCounter + newFiles[lastIdx].order;   
          }
          
          for (let i = 0; i < e.target.files.length; i++) {
            console.log(newFiles.accepted[i]);
            newFiles.results.push({
                id: e.target.files[i].name + '-' + i,
                name: e.target.files[i].name,
                file: e.target.files[i],
                order: orderCounter + i,
                image: URL.createObjectURL(e.target.files[i])
            });
          }
          setFiles([...files, ...newFiles.results]);
        })
    };

    const onNameChange = (e) => {
        setCollectionName(e.target.value);
    };

    const handleDrag = (e) => {
        setDragID(e.currentTarget.id);
    }

    const handleDrop = (e) => {
        const dragImg = files.find((file) => file.id === dragID);
        const dropImg = files.find((file) => file.id === e.currentTarget.id);

        const dragImgOrder = dragImg.order;
        const dropImgOrder = dropImg.order;

        const newImgState = files.map((file) => {
            if(file.id === dragID){
                file.order = dropImgOrder;
            }
            if(file.id === e.currentTarget.id){
                file.order = dragImgOrder
            }
            return file;
        })

        setFiles(newImgState);
    }

    const removeFile = (e) => {
        const img = files.find((file) => file.id === e.currentTarget.parentNode.id);
        if(img){
            let filesCopy = [...files]; 
            let orderState = false;
            for(let i = 0; i < files.length; i++){
                if(files[i].id === img.id){
                    filesCopy.splice(i, 1)
                    orderState = true;
                }
                if(orderState){
                    files[i].order = files[i].order - 1;
                }
            }
            console.log(filesCopy)
            setFiles(filesCopy);
        }
    }

    return (
        <div className="app">
            <div className="upload-bay">
                <form onSubmit={onFileDownload}>
                <input type="text" required onChange={onNameChange} />
                <input type="file" className="fileInput" id="fileInput" multiple name="file" onChange={onFileChange} />
                <label for="fileInput">
                    {files[0]
                        ? files.length + ' Files Selected'
                        : 'Select Files'
                    }
                </label>
                <button type="submit">Download</button>
                </form>
            </div>
            <div className="display-box">
                <div className="image-display flex-row">
                    {files
                    .sort((a, b) => a.order - b.order)
                    .map((img) => (
                        <ImagePreview
                        key={img.order}
                        imgID={img.id}
                        order={img.order}
                        image={img.image}
                        handleDrag={handleDrag}
                        handleDrop={handleDrop}
                        removeFile={removeFile}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
export default App;
