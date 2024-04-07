"use client";
import SideBar from "@/components/SideBar";
import Button from "@mui/material/Button";


import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { useState, ChangeEvent, useRef } from "react";
import PublishIcon from "@mui/icons-material/Publish";
import Card from "@mui/material/Card";
import AlertDialog from "@/components/Dialog";
import CircularProgress from "@mui/material/CircularProgress";
import { countWords, handleFileChange, handlePaste, handlePasteClick } from "../utils/CommonFunctions";

const Summarize = () => {
  const [value, setValue] = useState("Short");
  const editorRef = useRef<HTMLDivElement | null>(null);
  const outputRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
  };
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [isEditorEmpty, setIsEditorEmpty] = useState(true);
  const [inputWordCount, setInputWordCount] = useState(0);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const summarizeText = async () => {
    try {
      if (inputWordCount > 100) {
        console.log(inputWordCount);
        setIsDialogOpen(true);
        return;
      }
      const textData = editorRef.current!.innerText;
      if (!textData.trim()) {
        return;
      }
  
      setIsSummarizing(true);
  
      const response = await fetch("http://localhost:5000/summarize-text", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          textData: editorRef.current!.innerText,
          length: value,
        }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to summarize text. Please try again later.");
      }
  
      const result = await response.json();
      setIsSummarizing(false);
      const summarizedText = result.queryResult;
      outputRef.current!.innerHTML = "";
      outputRef.current!.innerHTML = summarizedText;
  
    } catch (error) {
      setIsSummarizing(false);
      console.error("Error summarizing text:", error);
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

  return (
    <>
      <SideBar pageTitle="Summarizer">
        <section className="input-output-container">
          <Card sx={{ borderRadius: 0 }} className="summarize-length-section">
            <FormControl
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                padding: 4,
              }}
            >
              <FormLabel sx={{ width: "150px", mr: 2 }}>
                Summary Length
              </FormLabel>
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
                  value="Very Short"
                  control={<Radio />}
                  label="Very Short"
                />
                <FormControlLabel
                  value="Short"
                  control={<Radio />}
                  label="Short"
                />
                <FormControlLabel
                  value="Medium-length"
                  control={<Radio />}
                  label="Medium"
                />
                <FormControlLabel
                  value="Detailed"
                  control={<Radio />}
                  label="Detailed"
                />
              </RadioGroup>
            </FormControl>
          </Card>
          <Card sx={{ borderRadius: 0 }} className="input-output-section">
            <section className="input-container">
              <div
                contentEditable
                className="editable"
                ref={editorRef}
                onPaste={(e:any)=>handlePaste(e, editorRef, setInputWordCount,setIsEditorEmpty )}
                onInput={(e: any) => handleEditorChange(e)}
              ></div>
              <div className="sub_div">
                {isEditorEmpty ? (
                  <Button
                    sx={{ textTransform: "none" }}
                    variant="outlined"
                    onClick={(e)=>handlePasteClick(editorRef, setIsEditorEmpty, setInputWordCount )}
                  >
                    Paste
                  </Button>
                ) : null}
                {isSummarizing ? <CircularProgress size={30} /> : ""}

                {isEditorEmpty ? (
                  <div>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e)=>handleFileChange(e, editorRef, setInputWordCount, setIsEditorEmpty)}
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
                    onClick={summarizeText}
                    disabled={isSummarizing}
                  >
                    Summarize
                  </Button>
                )}
              </div>
            </section>
            <section className="output-container">
              <div className="output" ref={outputRef}></div>
             
            </section>
          </Card>
        </section>
      </SideBar>
      <AlertDialog
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        dialogTitle="Word Limit Exceeded"
        dialogContent="Text Summarization is currently limited to 100 words."
      />
    </>
  );
};
export default Summarize;
