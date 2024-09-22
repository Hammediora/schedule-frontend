// components/ScheduleComponent/EditableShift.js

import React, { useState } from 'react';
import { Box, TextField, IconButton, Typography } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';

const EditableShift = ({ userId, day, shiftData, handleShiftChange, handleSave }) => {
  const [editMode, setEditMode] = useState(false);
  const [shiftTime, setShiftTime] = useState(shiftData.time);

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleSaveClick = () => {
    handleSave(userId, day, shiftData.scheduleId, shiftTime);
    setEditMode(false);
  };

  const handleInputChange = (e) => {
    setShiftTime(e.target.value);
    handleShiftChange(userId, day, e.target.value);
  };

  return (
    <Box>
      {/* Editable TextField for shift time */}
      {editMode ? (
        <>
          <TextField
            value={shiftTime}
            onChange={handleInputChange}
            onBlur={handleSaveClick}
            size="small"
          />
          <IconButton onClick={handleSaveClick}>
            <SaveIcon />
          </IconButton>
        </>
      ) : (
        <Box onClick={handleEditClick}>
          {/* Show shift time and task */}
          <Typography variant="body2">{shiftData.formattedTime}</Typography>
          <Typography variant="caption">{shiftData.task}</Typography>
        </Box>
      )}
    </Box>
  );
};

export default EditableShift;
