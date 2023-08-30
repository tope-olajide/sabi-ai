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
} from "@mui/material";
import React, {
  ChangeEvent,
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import DeleteIcon from "@mui/icons-material/Delete";
const Editor = () => {
  const editorRef = useRef<HTMLDivElement | null>(null);
  function excemptWord(htmlString: string, exceptionList: string | string[]) {
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


  const [exceptionList, setExceptionList] = useState([""]);
  const [isCheckingGrammar, setIsCheckingGrammar] = useState(false);
  const [isCheckingError, setIsCheckingError] = useState(false);
  const checkWords = async () => {
    const textData = editorRef.current!.innerText
    if (!textData.trim()) {
      return 
    }
    try {
      setIsCheckingGrammar(true)
      const response = await fetch("https://sability-ai.onrender.com/grammar-check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({textData:editorRef.current!.innerText}),
      });
     const result = await response.json();
      console.log(result.queryResult.response)
      setIsCheckingGrammar(false)
       const newHTMLData = result.queryResult.response;
      editorRef.current!.innerHTML = '';
      editorRef.current!.innerHTML = newHTMLData; 
    } catch (error) {
      console.log(error);
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
  const [selectedWord, setSelectedWord] = useState<SelectedWord>();
  const [anchorEl, setAnchorEl] = useState<HTMLSpanElement | null>(null);

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const handleClose = () => {
    setAnchorEl(null);
  };
  const correctWord = () => {
    const textNode = document.createTextNode(selectedWord!.corrected);
    anchorEl?.parentNode?.replaceChild(textNode, anchorEl);
    console.log(editorRef.current!.innerText)
    handleClose();
  };

  let timer: NodeJS.Timeout;
  const handleEditorChange = (event: ChangeEvent<HTMLDivElement>) => {
    clearTimeout(timer);
    const newTimer: NodeJS.Timeout = setTimeout(async () => {
  
      await checkWords()
      
      console.log(editorRef.current!.innerText);
    }, 1000);
    timer = newTimer;
  };
  
  useEffect(() => {
    editorRef.current!.innerText = 'Sability AI help you to improve your content on millions of websites! Write or paste your sentense to get it checked for gramar and spelling errors. If there is a mistake, the app will highlight it. Just hover over the correction to review and acept it!'
  }, []);
 
  useEffect(() => {
    checkWords();
  }, [exceptionList]);
  useEffect(() => {
    const handleClickOnHighlight = (event:any) => {
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
    <Box
      className="editor-section"
    >
      <div
        contentEditable
        className="editor"
        onInput={(e:any) => handleEditorChange(e)}
        ref={editorRef}
        />
        <div className="editor-options">
        {isCheckingGrammar?<CircularProgress size={30} />:null} {/* <div className="checking-progress"> <CircularProgress size={20} /><p> Checking Grammar</p></div> */}
        </div>
      </Box>

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
      
    </>
  );
};

export default Editor;
