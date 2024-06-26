"use client";
import SideBar from "@/components/SideBar";
import Button from "@mui/material/Button";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Box, Card, CircularProgress } from "@mui/material";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import PublishIcon from "@mui/icons-material/Publish";
import AlertDialog from "@/components/Dialog";
import { countWords, handleFileChange, handlePaste, handlePasteClick } from "../utils/CommonFunctions";

const Paraphraser = () => {
  const [value, setValue] = useState("Normal");
  const [inputWordCount, setInputWordCount] = useState(0);
  const [isEditorEmpty, setIsEditorEmpty] = useState(true);
  const [isDialogOpen, setIsDialogOpen]  = useState(false);
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
  };
  const editorRef = useRef<HTMLDivElement | null>(null);
  const outputRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);



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
    try {
      const textData = editorRef.current!.innerText;
      if (!textData.trim()) {
        return;
      }
      if (inputWordCount > 100) {
        setIsDialogOpen(true);
        return;
      }
  
      setIsParaphrasing(true);
  
      const response = await fetch("https://sability-ai.onrender.com/paraphrase-text", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          textData: editorRef.current!.innerText,
          mode: value,
        }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to paraphrase text. Please try again later.");
      }
  
      const result = await response.json();
      setIsParaphrasing(false);
      const paraphrasedText = result.queryResult;
      outputRef.current!.innerHTML = "";
      outputRef.current!.innerHTML = paraphrasedText;
  
    } catch (error) {
      setIsParaphrasing(false);
      console.error("Error paraphrasing text:", error);
    }
  };
  

  const focusEditor = () => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  useEffect(() => {
    focusEditor();
  }, []);
  return (
    <>
      <SideBar pageTitle={"Paraphraser"}>
        <Card className="input-output-container">
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
            <section className="input-container" onClick={focusEditor}>
              <div
                ref={editorRef}
                contentEditable
                className="editable"
                onInput={(e: any) => handleEditorChange(e)}
                onPaste={(e:any)=>handlePaste(e, editorRef, setInputWordCount,setIsEditorEmpty )}
              />

              <div className="sub_div">
                {isEditorEmpty ? (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      width: "100%",
                    }}
                  >
                    <Button
                      sx={{
                        fontWeight: "bold",
                        textTransform: "none",
                        borderRadius: 5,
                      }}
                      variant="outlined"
                      startIcon={<ContentPasteIcon />}
                      onClick={(e)=>handlePasteClick(editorRef, setIsEditorEmpty, setInputWordCount )}
                      size="small"
                    >
                      Paste Text
                    </Button>
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
                  </Box>
                ) :
                   
                  (
                    
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      width: "100%",
                      alignItems: "center",
                    }}
                  >
                    <p>Words:{inputWordCount}</p>
{isParaphrasing?<CircularProgress size={30} />:""}
                    <Button
                      sx={{ textTransform: "Capitalize" }}
                      variant="contained"
                      onClick={paraphraseText}
                      disabled={isParaphrasing}
                    >
                      Paraphrase
                    </Button>
                  </Box>
                )}
              </div>
            </section>
            <section className="output-container">
              <div className="output" ref={outputRef}></div>
            </section>
          </section>
        </Card>
      </SideBar>
      <AlertDialog isDialogOpen={isDialogOpen} setIsDialogOpen={setIsDialogOpen} dialogTitle="Word Limit Exceeded" dialogContent="Text Paraphrasing is currently limited to 100 words."/>
    </>
  );
};
export default Paraphraser;
