import React, { useState, useRef } from "react";
import { useEffect } from "react";
const UploadImage = () => {
    const [image, setImage] = useState(null);
    const uploadedImage = useRef(null);
    const imageUploader = useRef(null);
    const handleImage = async (e) => {
        e.preventDefault();
        try {
            let file = e.target.files[0];
            file && setImage(file);
            if (file) {
                const reader = new FileReader();
                const { current } = uploadedImage;
                current.file = file;
                reader.onload = (e) => {
                    current.src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <div>
       <div className="form-group">
								<label>
									Add Photo <i className="fa fa-camera"></i>
								</label>
								<br />

								<div
									style={{
										height: "60px",
										width: "60px",
										border: "1px dashed black",
										borderRadius: "100%",
									}}
									onClick={() => imageUploader.current.click()}
								>
									<img
										ref={uploadedImage}
										style={{
											height: "60px",
											width: "60px",
											border: "none",
											borderRadius: "50%",
										}}
									></img>
								</div>
								<div className="container">
									<input
										onChange={(e) => handleImage(e)}
										ref={imageUploader}
										type="file"
										accept="image/*"
										multiple={false}
										name="PetImageLoc"
										style={{
											display: "none",
										}}
									/>
								</div>
							</div>
							<p></p>
        </div>
    );
    }