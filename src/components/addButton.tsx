import React from "react";
import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";

const AddButton: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Button
      variant="contained"
      startIcon={<AddIcon />}
      //onClick={() => navigate("/devices")}
      sx={{
        borderRadius: "12px",
        textTransform: "none",
        maxHeight: "60px",
        fontSize: "16px",
        fontWeight: 500,
        padding: "10px 22px",
        background: "linear-gradient(90deg, #337DD6, #1970D0)",
        boxShadow: "none",
        "&:hover": {
          background: "linear-gradient(90deg, #357ABD, #2F6FA3)",
          boxShadow: "none",
        },
      }}
    >
      Create Device
    </Button>
  );
};

export default AddButton;
