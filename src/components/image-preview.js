import React from "react";

const ImagePreview = ({imgID, removeFile, order, image, handleDrag, handleDrop}) => {
    return(
            <div 
                draggable 
                id={imgID}
                onDragStart={handleDrag}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                className="image-preview-frame flex-col"
            >
            <div onClick={removeFile} className="remove-btn">
                x
            </div>
            <img className="image-preview" src={image} alt={order} />
            {order}
        </div>
    )
}

export default ImagePreview;