"use client";
import SideBar from "@/components/SideBar";
import Button from "@mui/material/Button";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { ChangeEvent, useRef, useState } from "react";
import { Box } from "@mui/material";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import PublishIcon from "@mui/icons-material/Publish";
import MobileNav from "@/components/MobileNav";

const Paraphraser = () => {
  const [value, setValue] = useState("Normal");
  const [inputWordCount, setInputWordCount] = useState(0);
  const [isEditorEmpty, setIsEditorEmpty] = useState(true);
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
  };
  const editorRef = useRef<HTMLDivElement | null>(null);
  const outputRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
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

  const countWords = (text: string) => {
    const words = text.split(" ");
    const filteredWords = words.filter((word) => word.trim() !== "");
    return filteredWords.length;
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

  const handleEditorChange = (event: ChangeEvent<HTMLDivElement>) => {
    if (editorRef.current?.innerHTML) {
      setIsEditorEmpty(false);
    } else {
      setIsEditorEmpty(true);
    }
    setInputWordCount(countWords(editorRef.current!.innerText));
  };
  const [isParaphrasing, setIsParaphrasing] = useState(false);
  const paraphraseText = async () => {
    const textData = editorRef.current!.innerText;
    if (!textData.trim()) {
      return;
    }
    try {
      setIsParaphrasing(true);
      const response = await fetch(
        "https://sability-ai.onrender.com/paraphrase-text",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            textData: editorRef.current!.innerText,
            mode: value,
          }),
        }
      );
      const result = await response.json();
      console.log(result.queryResult.response);
      setIsParaphrasing(false);
      const paraphrasedText = result.queryResult.response;
      outputRef.current!.innerHTML = "";
      outputRef.current!.innerHTML = paraphrasedText;
    } catch (error) {
      setIsParaphrasing(false);
      console.log(error);
    }
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
  return (
    <>
      <SideBar pageTitle={"Paraphraser"}>
      
        <section className="input-output-container">
          
          <div className="modes-section">
            <FormControl
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <FormLabel sx={{ mr: 4 }}>Modes: </FormLabel>
              <RadioGroup
                aria-labelledby="demo-controlled-radio-buttons-group"
                name="controlled-radio-buttons-group"
                value={value}
                onChange={handleChange}
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "nowrap",
                  width: "100%",
                }}
              >
                <FormControlLabel
                  value="Normal"
                  control={<Radio />}
                  label="Normal"
                />
                <FormControlLabel
                  value="Fluency"
                  control={<Radio />}
                  label="Fluency"
                />
                <FormControlLabel
                  value="Professional"
                  control={<Radio />}
                  label="Professional"
                />
                <FormControlLabel
                  value="Simple"
                  control={<Radio />}
                  label="Simple"
                />
                <FormControlLabel
                  value="Academic"
                  control={<Radio />}
                  label="Academic"
                />
                 <FormControlLabel
                  value="Creative"
                  control={<Radio />}
                  label="Creative"
                />
                <FormControlLabel
                  value="Expand"
                  control={<Radio />}
                  label="Expand"
                />
                <FormControlLabel
                  value="Shorten"
                  control={<Radio />}
                  label="Shorten"
                /> 
              </RadioGroup>
            </FormControl>
          </div>
          <section className="input-output-section">
            <section className="input-container">
              <div
                ref={editorRef}
                contentEditable
                className="editable"
                onInput={(e: any) => handleEditorChange(e)}
                onPaste={handlePaste}
              />

              <div className="sub_div">
                {isEditorEmpty ? (
                  <Box sx={{ display:'flex', justifyContent:'space-between', width:'100%'}}>
                    <Button
                      sx={{
                        
                        fontWeight: "bold",
                        textTransform: "none",
                        borderRadius: 5,
                      }}
                      variant="outlined"
                      startIcon={<ContentPasteIcon />}
                      onClick={handlePasteClick}
                      size="small"
                    >
                      Paste Text
                    </Button>
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
                  </Box>
                ) : <Box  sx={{ display:'flex', justifyContent:'space-between', width:'100%', alignItems:'center'}}>
                  <p>Words:{inputWordCount}</p>
                    
                    <Button
                  sx={{ textTransform: "Capitalize" }}
                  variant="contained"
                  onClick={paraphraseText}
                  disabled={isParaphrasing}
                >
                  Paraphrase
                </Button>
                </Box>}

                
              </div>
            </section>
            <section className="output-container">
              <div className="output" ref={outputRef}></div>
            </section>
          </section>
        </section>
      </SideBar>
    </>
  );
};
export default Paraphraser;
