import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  IconButton,
  Tooltip,
  Paper,
  Stack,
  Snackbar,
  Alert,
} from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import {
  fetchMentalMessages,
  postMentalMessage,
  reactToMentalMessage,
} from "../services/apiService";

const reactionIcons = {
  like: <ThumbUpIcon color="primary" />,
  love: <FavoriteIcon color="error" />,
  dislike: <ThumbDownIcon color="action" />,
};

const MentalHealthSupport = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      fetchMentalMessages()
        .then((res) => setMessages(res.data))
        .catch(() =>
          setSnackbar({
            open: true,
            message: "Failed to load messages.",
            severity: "error",
          })
        );
    } finally {
      setLoading(false);
    }
  };

  const submitMessage = async () => {
    if (!message.trim()) return;

    if (message.length > 255) {
      setSnackbar({
        open: true,
        message: "Message too long (max 255 characters).",
        severity: "warning",
      });
      return;
    }

    setPosting(true);
    try {
      await postMentalMessage(message);
      setMessage("");
      await fetchMessages();
      setSnackbar({
        open: true,
        message: "Message posted!",
        severity: "success",
      });
    } catch (err) {
      console.error("Error posting message", err);
      setSnackbar({
        open: true,
        message: "Failed to post message.",
        severity: "error",
      });
    } finally {
      setPosting(false);
    }
  };

  const reactToMessage = async (messageId, type) => {
    try {
      await reactToMentalMessage(messageId, type);
      fetchMessages();
    } catch (err) {
      console.error("Error sending reaction", err);
    }
  };

  return (
    <Box sx={{ mt: 4, maxWidth: 1200, mx: "auto" }}>
      <Typography variant="h5" gutterBottom>
        💬 Anonymous Support Messages
      </Typography>

      {loading ? (
        <Box textAlign="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
          <TextField
            multiline
            fullWidth
            label="Write something supportive..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            inputProps={{ maxLength: 255 }}
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            onClick={submitMessage}
            disabled={posting}
          >
            {posting ? "Posting..." : "Post Message"}
          </Button>
        </Paper>
      )}

      <List>
        {messages.map((msg) => (
          <ListItem
            key={msg.id}
            sx={{
              background: "#f9f9f9",
              borderRadius: 2,
              mb: 2,
              boxShadow: 1,
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <ListItemText
              primary={msg.content}
              secondary={new Date(msg.timestamp).toLocaleString()}
            />

            <Stack direction="row" spacing={2} mt={1}>
              {["like", "love", "dislike"].map((type) => (
                <Tooltip
                  key={type}
                  title={type.charAt(0).toUpperCase() + type.slice(1)}
                >
                  <IconButton
                    onClick={() => reactToMessage(msg.id, type)}
                    sx={{
                      backgroundColor:
                        msg.userReaction === type ? "#e3f2fd" : "#fafafa",
                      border:
                        msg.userReaction === type
                          ? "2px solid #1976d2"
                          : "1px solid #e0e0e0",
                      color: msg.userReaction === type ? "#1976d2" : "#555",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        backgroundColor: "#e0f7fa",
                        transform: "scale(1.05)",
                      },
                      borderRadius: "12px",
                      padding: "6px 12px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      {reactionIcons[type]}
                      <Typography variant="body2" fontWeight={500}>
                        {msg.reactions?.[type] || 0}
                      </Typography>
                    </Box>
                  </IconButton>
                </Tooltip>
              ))}
            </Stack>
          </ListItem>
        ))}
      </List>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MentalHealthSupport;
