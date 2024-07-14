import { useState, useEffect, useRef } from 'react';
import { IconContext } from "react-icons";
import { TbDragDrop } from "react-icons/tb";
import { IoCloudUpload } from "react-icons/io5";
import { FaTrash } from "react-icons/fa";
import "primereact/resources/themes/lara-light-indigo/theme.css";     
import 'primeicons/primeicons.css';
import styles from './assets/css/App.module.css';
import PDFIcon from './assets/images/pdf-icon.png';

function DragDropPDF({ id }) {

const [selectedPDF, setselectedPDF] = useState();
const [preview, setPreview] = useState();
const inputRef = useRef();

useEffect(() => 
{
    if (!selectedPDF) 
    {
        setPreview(undefined)
        return
    }

    setPreview(selectedPDF.name);

}, [selectedPDF])

const onImageSelect = e => 
{
    if (!e.target.files || e.target.files.length === 0 || !e.target.files[0].type === 'application/pdf') 
    {
      setselectedPDF(undefined)
        return;
    }

    setselectedPDF(e.target.files[0]);
}

const handleDeleteFile = () => 
{
    if (inputRef.current.value) 
    {
      setselectedPDF(undefined)

      setPreview(undefined)

      inputRef.current.value = null;
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

  if (file && file.type === 'application/pdf')
    {
      const reader = new FileReader();

      reader.onloadend = () => 
      {
        setPreview(file.name);
      };

      setselectedPDF(file);

      let container = new DataTransfer(); 

      container.items.add(file);

      inputRef.current.files = container.files;
  }
}

  return (
  <div className={styles.Container}>
      <div className={styles.Box} onDrop={handleDrop} onDragOver={handleDragOver}>
        <div className={styles.DragDrop} style={selectedPDF && {display: 'none'}}>
        <TbDragDrop />
        <span className={styles.DragDropText}>قم بسحب الملف وضعه هنا</span>
        </div>
        <div className={styles.PDfContainer} style={selectedPDF? {display: 'block'} : {display: 'none'} }>
            <img className={styles.PDFImage} src={PDFIcon} />
            <span className={styles.PDFText}>{preview}</span>
        </div>
        <label htmlFor={`ImageUpload_${id}`} className={styles.ImageUpload}>
            <IoCloudUpload />
            اختر ملف من جهازك
        </label>
        <div className={styles.DeleteImage} style={selectedPDF? {display: 'block'} : {display: 'none'}} onClick={handleDeleteFile}>
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

export default DragDropPDF