import React, { useState, FC, useEffect } from "react";
import { Avatar, IconButton } from "@mui/material";
import CameraAltIcon from '@material-ui/icons/CameraAlt';
import { CircularProgress } from "@material-ui/core";
import { useDispatch } from "react-redux";
import { uploadFile } from "store/main/actions";
import { useSelector } from "hooks";
import { PhotoProps } from "../model";

const Photo: FC<PhotoProps> = ({ src, radius, setValue }) => {
    const [waitUploadFile, setWaitUploadFile] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [image, setImage] = useState(src);
    const dispatch = useDispatch();
    const uploadResult = useSelector((state) => state.main.uploadFile);

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };


    useEffect(() => {
        if (waitUploadFile) {
            if (!uploadResult.loading && !uploadResult.error) {
                setImage(uploadResult?.url || "")
                setValue("imageurldef", uploadResult.url);
                setWaitUploadFile(false);
            } else if (uploadResult.error) {
                setWaitUploadFile(false);
            }
        }
    }, [waitUploadFile, uploadResult]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const selectedFile = event.target.files[0];
            var fd = new FormData();
            fd.append("file", selectedFile, selectedFile.name);
            dispatch(uploadFile(fd));
            setIsHovered(false)
            setWaitUploadFile(true);
        }
    };

    return (
        <div
            style={{
                position: "relative",
                display: "flex",
                borderRadius: "50%",
                height: 150,
                width: "100%",
                justifyContent: "center"

            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {waitUploadFile ? (
                <CircularProgress
                    style={{
                        position: "absolute",
                        width: 150,
                        height: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: "50%",
                    }} />
            ) : (
                <Avatar
                    alt="Profile"
                    src={image}
                    style={{
                        position: "absolute",
                        width: 150,
                        height: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: "50%",
                    }}
                />
            )
            }

            {(isHovered && !waitUploadFile) && (
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        width: 150,
                        height: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        borderRadius: "50%",
                    }}
                >
                    <IconButton component="label">
                        <CameraAltIcon style={{ color: "white", fontSize: "2rem" }} />
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            style={{ display: "none" }}
                        />
                    </IconButton>
                </div>
            )}
        </div>
    );
};

export default Photo;