import { ChangeEvent } from "react";

const countWords = (text: string) => {
    const words = text.split(" ");
    const filteredWords = words.filter((word) => word.trim() !== "");
    return filteredWords.length;
};

const handlePaste = (e: any, editorRef: React.RefObject<HTMLDivElement>, setInputWordCount: React.Dispatch<React.SetStateAction<number>>, setIsEditorEmpty: React.Dispatch<React.SetStateAction<boolean>>) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text/plain");
    const selection = window.getSelection();
    const range = selection!.getRangeAt(0);
    range.deleteContents();
    const textNode = document.createTextNode(text);
    range.insertNode(textNode);
    range.setStartAfter(textNode);
    range.collapse(true);
    selection!.removeAllRanges();
    selection!.addRange(range);
    setInputWordCount(countWords(editorRef.current!.innerText));
    setIsEditorEmpty(false);
};
  
const handleFileChange = async (e: ChangeEvent<HTMLInputElement>, editorRef: React.RefObject<HTMLDivElement>, setInputWordCount: React.Dispatch<React.SetStateAction<number>>, setIsEditorEmpty: React.Dispatch<React.SetStateAction<boolean>>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("/grammar-checker/api", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      if (result.success === false) {
        console.log(result.message);
        return alert(result.message);
      }
      editorRef.current!.innerHTML = "";
      editorRef.current!.innerHTML = result.data;
      setIsEditorEmpty(false);
      setInputWordCount(countWords(editorRef.current!.innerText));
    } else {
      alert("Please select a PDF file.");
    }
};
  
const handlePasteClick = async (
    editorRef: React.RefObject<HTMLDivElement>,
    setIsEditorEmpty: React.Dispatch<React.SetStateAction<boolean>>,
    setInputWordCount: React.Dispatch<React.SetStateAction<number>>
  ) => {
    try {
      const text = await navigator.clipboard.readText();
      if (editorRef.current) {
        const div = editorRef.current;
        const selection = window.getSelection();
        if (selection) {
          const range = selection.getRangeAt(0);
          const textNode = document.createTextNode(text);
          range.deleteContents();
          range.insertNode(textNode);
          selection.removeAllRanges();
          selection.addRange(range);
          div.focus();
          setIsEditorEmpty(false);
          setInputWordCount(countWords(editorRef.current!.innerText));
        }
      }
    } catch (error) {
      console.error("Unable to read clipboard data: ", error);
    }
  };
  
export {countWords, handlePaste, handleFileChange, handlePasteClick};