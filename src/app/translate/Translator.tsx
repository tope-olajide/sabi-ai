"use client";
import SideBar from "@/components/SideBar";
import Button from "@mui/material/Button";

import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { useState, ChangeEvent, useRef } from "react";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import PublishIcon from "@mui/icons-material/Publish";

const Translator = () => {
  const [value, setValue] = useState("Short");
  const editorRef = useRef<HTMLDivElement | null>(null);
  const outputRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [language, setLanguage] = useState("");
  const [inputWordCount, setInputWordCount] = useState(0);
  const handleChange = (event: SelectChangeEvent) => {
    setLanguage(event.target.value as string);
  };

  const [isTranslating, setIsTranslating] = useState(false);
  const [isEditorEmpty, setIsEditorEmpty] = useState(true);
  const translateText = async () => {
    const textData = editorRef.current!.innerText;
    if (!textData.trim()) {
      return;
    }
    if (!language) {
      return alert('Please select a target language!')
    }
    try {
      setIsTranslating(true);
      const response = await fetch("http://localhost:5000/translate-text", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          textData: editorRef.current!.innerText,
          language,
        }),
      });
      const result = await response.json();
      console.log(result.queryResult.response);
      setIsTranslating(false);
      const translated = result.queryResult.response;
      outputRef.current!.innerHTML = "";
      outputRef.current!.innerHTML = translated;
    } catch (error) {
      setIsTranslating(false);
      console.log(error);
    }
  };
  const handleEditorChange = (event: ChangeEvent<HTMLDivElement>) => {
    if (editorRef.current?.innerHTML) {
      setIsEditorEmpty(false);
    } else {
      setIsEditorEmpty(true);
    }
    setInputWordCount(countWords(editorRef.current!.innerText));
  };
  const handlePaste = (e: any) => {
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
    setIsEditorEmpty(false);
  };
  const countWords = (text: string) => {
    const words = text.split(" ");
    const filteredWords = words.filter((word) => word.trim() !== "");
    return filteredWords.length;
  };
  const handlePasteClick = async () => {
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
  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
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
  return (
    <>
      <SideBar pageTitle="Translator">
        <section className="input-output-container">
          <div className="translate-header-section">
            <FormControl sx={{ minWidth: "140px" }} disabled size="small">
              <InputLabel>Auto Detect</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
              ></Select>
            </FormControl>
            <FormControl sx={{ minWidth: "150px" }} size="small">
              <InputLabel id="demo-simple-select-label">
                Target Language
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={language}
                label="Language"
                onChange={handleChange}
              >
                <MenuItem value={"English"}>English</MenuItem>
                <MenuItem value={"Spanish"}>Spanish</MenuItem>
                <MenuItem value={"French"}>French</MenuItem>
                <MenuItem value={"German"}>German</MenuItem>
                <MenuItem value={"Chinese (Simplified and Traditional)"}>
                  Chinese (Simplified and Traditional)
                </MenuItem>
                <MenuItem value={"Japanese"}>Japanese</MenuItem>
                <MenuItem value={"Korean"}>Korean</MenuItem>
                <MenuItem value={"Italian"}>Italian</MenuItem>
                <MenuItem value={"Portuguese (European and Brazilian)"}>
                  Portuguese (European and Brazilian)
                </MenuItem>
              </Select>
            </FormControl>
          </div>
          <section className="input-output-section">
            <section className="input-container">
              <div
                contentEditable
                className="editable"
                ref={editorRef}
                onPaste={handlePaste}
                onInput={(e: any) => handleEditorChange(e)}
              ></div>
              <div className="sub_div">
                {isEditorEmpty ? (
                  <Button
                    sx={{ textTransform: "none" }}
                    variant="outlined"
                    onClick={handlePasteClick}
                  >
                    Paste
                  </Button>
                ) : null}
                {isEditorEmpty ? (
                  <div>
                    {" "}
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      style={{ display: "none" }}
                      ref={fileInputRef}
                    />
                    <Button
                      sx={{
                        fontWeight: "bold",
                        textTransform: "none",
                        borderRadius: 5,
                      }}
                      size="small"
                      variant="outlined"
                      startIcon={<PublishIcon />}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Upload PDF
                    </Button>
                  </div>
                ) : null}
                {isEditorEmpty ? null : <h5>Words:{inputWordCount}</h5>}
                {isEditorEmpty ? null : (
                  <Button
                    sx={{ textTransform: "Capitalize" }}
                    variant="contained"
                    onClick={translateText}
                    disabled={isTranslating}
                  >
                    {isTranslating?'Translating...':'Translate'}
                  </Button>
                )}
              </div>
            </section>
            <section className="output-container">
              <div className="output" ref={outputRef}></div>
              <div className="sub_div">
                {/*  <p>0 Sentences </p>

                <p>0 Words</p> */}
              </div>
            </section>
          </section>
        </section>
      </SideBar>
    </>
  );
};
export default Translator;
