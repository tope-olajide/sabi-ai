"use client";
import "./editor.css";
import {
  Popover,
  Box,
  Typography,
  Badge,
  IconButton,
  Button,
  Grid,
  CircularProgress,
  Card,
} from "@mui/material";
import React, {
  ChangeEvent,
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import PublishIcon from "@mui/icons-material/Publish";
import Divider from "@mui/material/Divider";
import AlertDialog from "@/components/Dialog";
import { countWords, handleFileChange, handlePaste, handlePasteClick } from "../utils/CommonFunctions";
const GrammarChecker = () => {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [wordCount, setWordCount] = useState(0);
  const [exceptionList, setExceptionList] = useState([""]);
  const [isCheckingGrammar, setIsCheckingGrammar] = useState(false);
  const [selectedWord, setSelectedWord] = useState<SelectedWord>();
  const [anchorEl, setAnchorEl] = useState<HTMLSpanElement | null>(null);
  const [isEditorEmpty, setIsEditorEmpty] = useState(true);
  const [contents, setContents] = useState("");
  const [isDialogOpen, setIsDialogOpen]  = useState(false);


  function exemptWord(htmlString: string, exceptionList: string | string[]) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, "text/html");
    const spans = doc.querySelectorAll(".highlight");
    spans.forEach((span) => {
      const correctedValue = span.textContent;
      if (correctedValue && exceptionList.includes(correctedValue)) {
        span.classList.remove("highlight");
        span.removeAttribute("data-corrected");
        span.removeAttribute("data-error-type");
      }
    });
    return doc.body.innerHTML;
  }

  const checkForGrammarErrors = async () => {
    try {
      if (!wordCount) {
        return;
      }
      if (wordCount > 100) {
        setIsDialogOpen(true);
        return;
      }
  
      setIsCheckingGrammar(true);
  
      const response = await fetch("https://sability-ai.onrender.com/grammar-check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ textData: editorRef.current!.innerText }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to check grammar. Please try again later.");
      }
  
      const result = await response.json();
      setIsCheckingGrammar(false);
  
      const apiResult = result.queryResult;
      editorRef.current!.innerHTML = "";
      editorRef.current!.innerHTML = exemptWord(apiResult, exceptionList);
      console.log(exemptWord(apiResult, exceptionList));
  
    } catch (error) {
      setIsCheckingGrammar(false);
      console.error("Error checking grammar:", error);
    }
  };
  
  const setExcemption = () => {
    const exceptionListCopy = [...exceptionList, selectedWord!.word];
    setExceptionList(exceptionListCopy);
    handleClose();
  };
  type SelectedWord = {
    corrected: string;
    errorType: string;
    word: string;
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const handleClose = () => {
    setAnchorEl(null);
  };
  const correctWord = () => {
    const textNode = document.createTextNode(selectedWord!.corrected);
    anchorEl?.parentNode?.replaceChild(textNode, anchorEl);
    console.log(editorRef.current!.innerText);
    handleClose();
  };

  const handleEditorChange = (event: ChangeEvent<HTMLDivElement>) => {
    if (editorRef.current?.innerText) {
      setIsEditorEmpty(false);
    } else {
      setIsEditorEmpty(true);
    }
    setWordCount(countWords(editorRef.current!.innerText));
    setContents(editorRef.current?.innerText || "");
  };



  const focusEditor = () => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  useEffect(() => {
    focusEditor();
  }, []);

  useEffect(() => {
    const result = exemptWord(editorRef.current!.innerHTML, exceptionList);
    editorRef.current!.innerHTML = "";
    editorRef.current!.innerHTML = result;
  }, [exceptionList]);

  useEffect(() => {
    const handleClickOnHighlight = (event: any) => {
      if (event.target.classList.contains("highlight")) {
        const clickedText = event.target.textContent;
        const corrected = event.target.dataset.corrected;
        const errorType = event.target.dataset.errorType;
        setSelectedWord({ word: clickedText, corrected, errorType });
        setAnchorEl(event.target);
      }
    };
    document.addEventListener("click", handleClickOnHighlight);
    return () => {
      document.removeEventListener("click", handleClickOnHighlight);
    };
  }, []);




  return (
    <>
      <Card className="editor-section" onClick={focusEditor}>
        <section>
          <div
            contentEditable
            className="editor"
            onInput={(e: any) => handleEditorChange(e)}
            ref={editorRef}
            onPaste={(e:any)=>handlePaste(e, editorRef, setWordCount,setIsEditorEmpty )}
          />
          {isEditorEmpty ? (
            <div className="placeholder-container">
              <h1 className="placeholder-text" onClick={focusEditor}>
                Start by writing, pasting (Ctrl + V) text, or uploading a
                document(pdf), then click the Check for Errors button.
              </h1>
              <Box sx={{ mt: 1 }}>
                <Button
                  sx={{
                    mr: 3,
                    mt: 1,
                    fontWeight: "bold",
                    textTransform: "none",
                    borderRadius: 5,
                  }}
                  size="small"
                  variant="outlined"
                  startIcon={<ContentPasteIcon />}
                  onClick={(e)=>handlePasteClick(editorRef, setIsEditorEmpty, setWordCount )}
                >
                  Paste Text
                </Button>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e)=>handleFileChange(e, editorRef, setWordCount, setIsEditorEmpty)}
                  style={{ display: "none" }}
                  ref={fileInputRef}
                />
                <Button
                  sx={{
                    fontWeight: "bold",
                    textTransform: "none",
                    borderRadius: 5,
                    mt: 1,
                  }}
                  size="small"
                  variant="outlined"
                  startIcon={<PublishIcon />}
                  onClick={() => fileInputRef.current?.click()}
                >
                  Upload Document
                </Button>
              </Box>
            </div>
          ) : null}
        </section>

        {isEditorEmpty ? null : (
          <Card className="editor-options" color="secondary">
            {isCheckingGrammar ? (
              <CircularProgress size={30} />
            ) : (
              <Button
                variant="contained"
                sx={{ textTransform: "none", borderRadius: 5 }}
                onClick={checkForGrammarErrors}
                size="small"
                color="primary"
              >
                Check for Errors
              </Button>
            )}
            <Divider orientation="vertical" flexItem />{" "}
            <div>{wordCount} Words</div>
            {/* <Divider orientation="vertical" flexItem />{" "} */}
            {/*  
         {" "}
          <Divider orientation="vertical" flexItem />
          <FileDownloadIcon /> <ContentCopyIcon />{" "} */}
          </Card>
        )}
      </Card>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography sx={{ p: 2, minWidth: "200px" }}>
            <Badge color="error" variant="dot" sx={{ mr: 1 }}></Badge>
            {selectedWord?.errorType}
          </Typography>
          <IconButton aria-label="delete" onClick={setExcemption}>
            <DeleteIcon sx={{ width: "20px", height: "20px" }} />
          </IconButton>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pb: 2,
          }}
        >
          <Button
            variant="contained"
            sx={{ textTransform: "none" }}
            onClick={correctWord}
          >
            {selectedWord?.corrected}
          </Button>
        </Box>
      </Popover>
      <AlertDialog isDialogOpen={isDialogOpen} setIsDialogOpen={setIsDialogOpen} dialogTitle="Word Limit Exceeded" dialogContent="Grammar checking is currently limited to 100 words."/>
    </>
  );
};

export default GrammarChecker;
