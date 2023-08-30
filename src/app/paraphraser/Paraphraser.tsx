"use client";
import SideBar from "@/components/SideBar";
import Button from "@mui/material/Button";

const Paraphraser = () => {
  return (
    <>
      <SideBar>
        <section className="input-output-container">
          <div className="modes-section">
            <h4>Modes:</h4> <p className="active">Normal</p> <p>Fluency</p>{" "}
            <p>Professional</p> <p>Simple</p>
          </div>
          <section className="input-output-section">
            <section className="input-container">
              <div contentEditable className="editable"></div>
              <div className="sub_div">
                <p>Words:34</p>
                <Button
                  sx={{ textTransform: "Capitalize" }}
                  variant="contained"
                >
                  Paraphrase
                </Button>
              </div>
            </section>
            <section className="output-container">
              <div className="output"></div>
            </section>
          </section>
        </section>
      </SideBar>
    </>
  );
};
export default Paraphraser;
