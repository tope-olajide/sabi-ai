"use client";
import SideBar from "@/components/SideBar";
import Button from "@mui/material/Button";
import Slider from "@mui/material/Slider";
function valuetext(value: number) {
  return value.toString();
}
const Summarize = () => {
  return (
    <>
      <SideBar pageTitle = 'Summarizer'>
        <section className="input-output-container">
          <div className="summarize-mode">
            <h4>Summary Length:</h4> <div className="slider-section"><h5>Short</h5><Slider sx={{width:'200px'}}
  aria-label="Temperature"
  defaultValue={30}
  getAriaValueText={valuetext}
  valueLabelDisplay="auto"
  step={10}
  marks
  min={10}
  max={50}
            />
            <h5>Long</h5></div>
          </div>
          <section className="input-output-section">
            <section className="input-container">
              <div contentEditable className="editable"></div>
              <div className="sub_div">
                {/* <p>Words:34</p> */}
                <Button sx={{ textTransform: "none" }} variant="outlined">Upload PDF</Button>
                <Button
                  sx={{ textTransform: "Capitalize" }}
                  variant="contained"
                >
                  Summarize
                </Button>
              </div>
            </section>
            <section className="output-container">
              <div className="output"></div>
              <div className="sub_div">
                {/* <p>Words:34</p> */}
                <p>0 Sentences </p>

<p>0 Words</p>
              </div>
            </section>
          </section>
        </section>
      </SideBar>
    </>
  );
};
export default Summarize;
