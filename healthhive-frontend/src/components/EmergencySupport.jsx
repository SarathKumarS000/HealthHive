import React, { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Divider,
  Paper,
  MenuItem,
} from "@mui/material";
import {
  getEmergencyContacts,
  addEmergencyContact,
} from "../services/apiService";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { useSelector } from "react-redux";

const EmergencySupport = () => {
  const [contacts, setContacts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    phoneNumber: "",
    relationship: "",
  });
  const [formError, setFormError] = useState("");
  const { username } = useSelector((state) => state.auth.user);

  const getContacts = () => {
    getEmergencyContacts(username)
      .then((res) => setContacts(res.data))
      .catch((err) => console.error("Error fetching contacts", err));
  };

  const isValidPhoneNumber = (phone) => {
    const phoneRegex = /^[6-9]\d{9}$/; // For Indian mobile numbers
    return phoneRegex.test(phone);
  };

  const addContact = async () => {
    if (!form.name || !form.phoneNumber || !form.relationship) {
      setFormError("Please fill in all fields.");
      return;
    }

    if (!isValidPhoneNumber(form.phoneNumber)) {
      setFormError(
        "Please enter a valid 10-digit phone number starting with 6-9."
      );
      return;
    }

    try {
      await addEmergencyContact({ ...form, username });
      setForm({ name: "", phoneNumber: "", relationship: "" });
      setFormError("");
      getContacts();
    } catch (err) {
      console.error("Error adding contact", err);
      setFormError("Something went wrong while saving the contact.");
    }
  };

  useEffect(() => {
    getContacts();
    // eslint-disable-next-line
  }, []);

  return (
    <Box sx={{ mt: 4, px: 3 }}>
      <Typography variant="h4" gutterBottom>
        🚨 Emergency Support
      </Typography>

      <Typography variant="subtitle1" color="text.secondary">
        Store your emergency contacts and access national helplines.
      </Typography>

      <Divider sx={{ my: 3 }} />

      <Grid container spacing={3}>
        {/* Add Contact Form */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              <PersonAddIcon /> Add Emergency Contact
            </Typography>
            <TextField
              label="Name"
              fullWidth
              sx={{ my: 1 }}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <TextField
              label="Phone Number"
              fullWidth
              sx={{ my: 1 }}
              value={form.phoneNumber}
              inputProps={{ maxLength: 10 }}
              onChange={(e) => {
                const digitsOnly = e.target.value.replace(/\D/g, "");
                setForm({ ...form, phoneNumber: digitsOnly.slice(0, 10) });
              }}
            />
            <TextField
              label="Relationship"
              select
              fullWidth
              sx={{ my: 1 }}
              value={form.relationship}
              onChange={(e) =>
                setForm({ ...form, relationship: e.target.value })
              }
            >
              {[
                "Father",
                "Mother",
                "Spouse",
                "Sibling",
                "Friend",
                "Colleague",
                "Relative",
                "Doctor",
                "Neighbour",
                "Guardian",
                "Other",
              ].map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>

            <Button
              variant="contained"
              onClick={addContact}
              fullWidth
              sx={{ mt: 2 }}
            >
              Save Contact
            </Button>
            {formError && (
              <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                {formError}
              </Typography>
            )}
          </Paper>
        </Grid>

        {/* Contact List */}
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            Your Contacts
          </Typography>
          <Grid container spacing={2}>
            {contacts.length === 0 ? (
              <Grid item xs={12}>
                <Typography variant="body1" color="text.secondary">
                  No emergency contacts added yet. Use the form to add one.
                </Typography>
              </Grid>
            ) : (
              contacts.map((c, idx) => (
                <Grid item xs={12} key={idx}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {c.name} ({c.relationship})
                      </Typography>
                      <Typography variant="body2">
                        📞 {c.phoneNumber}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            )}
          </Grid>
        </Grid>
      </Grid>

      <Divider sx={{ my: 4 }} />

      {/* National Helplines */}
      <Typography variant="h6" gutterBottom>
        <LocalPhoneIcon /> National Emergency Helplines
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" fontWeight="bold">
                Medical Emergency (India)
              </Typography>
              <Typography variant="body2">📞 108</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" fontWeight="bold">
                Mental Health Helpline
              </Typography>
              <Typography variant="body2">📞 1800-599-0019</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EmergencySupport;
