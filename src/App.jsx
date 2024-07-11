import { useState, useEffect, useRef } from 'react';
import { ContextMenu } from 'primereact/contextmenu';
import { IconContext } from "react-icons";
import { TbDragDrop } from "react-icons/tb";
import { IoCloudUpload } from "react-icons/io5";
import { FaTrash } from "react-icons/fa";
import "primereact/resources/themes/lara-light-indigo/theme.css";     
import 'primeicons/primeicons.css';
import styles from './assets/css/App.module.css';

function App({ id }) {

const [selectedImage, setSelectedImage] = useState();
const [preview, setPreview] = useState();
const inputRef = useRef();
const imgRef = useRef(null);
const contextRef = useRef(null);
const contextMenuItems = [
  {
    label:'لصق',
    icon: 'pi pi-clipboard',
    command: (e) => 
    {
      contextRef.current.hide(e);

      handleContextPastedImage();
    }
 }

];

useEffect(() => 
{
    if (!selectedImage) 
    {
        setPreview(undefined)
        return
    }

    const objectUrl = URL.createObjectURL(selectedImage);

    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl)

}, [selectedImage])

const onImageSelect = e => 
{
    if (!e.target.files || e.target.files.length === 0 || !e.target.files[0].type.startsWith('image/')) 
    {
      setSelectedImage(undefined)
        return;
    }

    setSelectedImage(e.target.files[0]);
}

const handleDeleteImage = () => 
{
    if (inputRef.current.value) 
    {
      setSelectedImage(undefined)

      setPreview(undefined)

      inputRef.current.value = null;
    }
}

const handleContextPastedImage = async () => 
{
      const items = await navigator.clipboard.read();
     
      if (items[0].types.includes('image/png')) 
      {
          const imageBlob = await items[0].getType('image/png');

          const imageFile = new File([imageBlob], "Question_" + new Date().getTime(),{type:"image/png", lastModified:new Date().getTime()}, 'utf-8');
 
          const objectUrl = URL.createObjectURL(imageFile);

          setSelectedImage(imageFile);

          setPreview(objectUrl);

          let container = new DataTransfer(); 

          container.items.add(imageFile);

          inputRef.current.files = container.files;

          return () => URL.revokeObjectURL(objectUrl);
      }
 
}

const handlePastedImage = e => 
{
    if(e.clipboardData)
    {
        const clipboardImage = e.clipboardData.items;

        const images = [].slice.call(clipboardImage).filter(function (item) 
        {
          return /^image\//.test(item.type);
        });

        if (images.length === 0) {
            return;
        }

        const image = images[0].getAsFile();

        const objectUrl = URL.createObjectURL(image);


        setPreview(objectUrl);

        const imageFile = new File([image], "Question_" + new Date().getTime(),{type:"image/png", lastModified:new Date().getTime()}, 'utf-8');

        setSelectedImage(imageFile);

        let container = new DataTransfer(); 

        container.items.add(imageFile);

        inputRef.current.files = container.files;

        return () => URL.revokeObjectURL(objectUrl);
    }
}

const handleDragOver = (e) => 
{
  e.preventDefault();
}

const handleDrop = (e) => 
{
  e.preventDefault();

  const file = e.dataTransfer.files[0];

  if (file && file.type.startsWith('image/'))
    {
      const reader = new FileReader();

      reader.onloadend = () => 
      {
        setPreview(reader.result);
      };

      setSelectedImage(file);

      let container = new DataTransfer(); 

      container.items.add(file);

      inputRef.current.files = container.files;

      return () => URL.revokeObjectURL(reader.result);
  }
}

useEffect(() => 
{
  if (imgRef.current && preview) 
  {
      imgRef.current.src = preview;
  }
}, [preview]);

  return (
  <div className={styles.Container}>
    <ContextMenu model={contextMenuItems} ref={contextRef} breakpoint="767px" style={{ width: '70px', padding: '12px', fontWeight: 'bold'}} />
      <div className={styles.Box} onPaste={handlePastedImage} onContextMenu={(e) => contextRef.current.show(e)} onDrop={handleDrop} onDragOver={handleDragOver}>
        <div className={styles.DragDrop} style={selectedImage && {display: 'none'}}>
        <TbDragDrop />
        <span className={styles.DragDropText}>قم بسحب/لصق الصورة وضعها هنا</span>
        </div>
        <img className={styles.Preview} ref={imgRef} src={preview} style={selectedImage? {display: 'block'} : {display: 'none'} } />
        <label htmlFor={`ImageUpload_${id}`} className={styles.ImageUpload}>
            <IoCloudUpload />
            اختر صورة من جهازك
        </label>
        <div className={styles.DeleteImage} style={selectedImage? {display: 'block'} : {display: 'none'}} onClick={handleDeleteImage}>
          <IconContext.Provider value={{ className: styles.DeleteButtonColor }} >
              <FaTrash />
              حذف
          </IconContext.Provider>
        </div>
        <input id={`ImageUpload_${id}`}  type="file" ref={inputRef} onChange={onImageSelect} />
      </div>
  </div>
  )

}

export default App