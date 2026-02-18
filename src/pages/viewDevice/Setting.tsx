import {
  Box,
  Typography,
  Grid,
  Button,
  Tabs,
  Tab,
  TextField,
  Checkbox,
  FormControlLabel,
  Link,
  Switch,
} from "@mui/material";
import { useState } from "react";
import UploadIcon from "@mui/icons-material/Upload";

export default function Settings( props: { deviceName?: string; model?: string } ) {
  const [tab, setTab] = useState(0);
  const [bootArgs, setBootArgs] = useState(
    "console=ttyLP0,115200 earlycon= root=/dev/mmcblk0p2",
  );
  const [storage, setStorage] = useState("128 GB");
  const [cpuCores, setCpuCores] = useState("3 cores");
  const [ram, setRam] = useState("3 GB");
  const [firmwareFile, setFirmwareFile] = useState<File | null>(null);
  const [m33File, setM33File] = useState<File | null>(null);
  const [deviceTreeFile, setDeviceTreeFile] = useState<File | null>(null);
  const [vmmioList, setVmmioList] = useState<
    { start: string; size: string; irq: string }[]
  >([]);

  const [sensorEnabled, setSensorEnabled] = useState(false);
  const [selectedCamera, setSelectedCamera] = useState("");
  const [selectedMic, setSelectedMic] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");

  const [disablePoweroff, setDisablePoweroff] = useState(false);

  // Reusable Info Row
  const InfoRow = ({ label, value }: { label: string; value: string }) => (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        py: 1.2,
      }}
    >
      <Typography sx={{ fontSize: 13, color: "#6b7280" }}>{label}</Typography>
      <Typography sx={{ fontSize: 13, color: "#111827" }}>{value}</Typography>
    </Box>
  );

  const handleAddVmmio = () => {
    setVmmioList([...vmmioList, { start: "", size: "", irq: "" }]);
  };

  const UploadBox = ({
    onFileSelect,
  }: {
    onFileSelect: (file: File) => void;
  }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        onFileSelect(e.target.files[0]);
      }
    };

    return (
      <Box
        component="label"
        sx={{
          display: "inline-flex",
          alignItems: "center",
          gap: 2,
          border: "1px dashed #d1d5db",
          borderRadius: 0.5, // sharper corners
          px: 2.5,
          py: 2,
          backgroundColor: "#ffffff",
          cursor: "pointer",
          width: 260,
          transition: "all 0.2s ease",
          "&:hover": {
            backgroundColor: "#f9fafb",
            borderColor: "#9ca3af",
          },
        }}
      >
        <input hidden type="file" onChange={handleChange} />

        {/* Icon */}
        <UploadIcon
          sx={{
            fontSize: 20,
            color: "#6b7280",
          }}
        />

        {/* Text */}
        <Typography
          sx={{
            fontSize: 13,
            color: "#374151",
            lineHeight: 1.4,
          }}
        >
          Drag file here or{" "}
          <Box
            component="span"
            sx={{
              color: "#111827",
              fontWeight: 500,
              textDecoration: "underline",
            }}
          >
            browse
          </Box>{" "}
          to upload
        </Typography>
      </Box>
    );
  };
  return (
    <Box
      sx={{
        // minHeight: "100vh",
        // px: { xs: 2, md: 4 },
         py: { xs: 3, md: 4 },
        // background:
        //   "linear-gradient(180deg, #eef3fb 0%, #f6f8fc 40%, #f4f6fa 100%)",
      }}
    >
      {/* <Typography
        variant="body2"
        sx={{ color: "#6b778c", mb: 2, fontSize: 13 }}
      >
        Devices / Auto Cloud
      </Typography> */}

      <Box
        sx={{
          backgroundColor: "#ffffff",
          borderRadius: 0.5,
          border: "1px solid #e6e9f0",
          p: { xs: 2, md: 3 },
        }}
      >
        {/* Header */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
          mb={3}
        >
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Settings
            </Typography>
            <Typography variant="body2" sx={{ color: "#8c98a9", fontSize: 13 }}>
              Create your device
            </Typography>
          </Box>

          <Box display="flex" alignItems="center" gap={1.5}>
            {/* <Button
              variant="outlined"
              sx={{
                borderRadius: 0.5,
                textTransform: "none",
                fontSize: 13,
                px: 3,
                py: 0.8,
                borderColor: "#d1d5db",
                color: "#374151",
                "&:hover": {
                  borderColor: "#9ca3af",
                  backgroundColor: "#f9fafb",
                },
              }}
            >
              Back
            </Button> */}

            <Button
              variant="contained"
              sx={{
                backgroundColor: "#0b3c5d",
                borderRadius: 0.5,
                textTransform: "none",
                fontSize: 13,
                px: 3,
                py: 0.8,
                boxShadow: "none",
                "&:hover": {
                  backgroundColor: "#072a44",
                  boxShadow: "none",
                },
              }}
            >
              Save & restart
            </Button>
          </Box>
        </Box>

        <Grid container spacing={3}>
          {/* LEFT SECTION */}
          <Grid size={{ xs: 12, md: 12 }}>
            {/* Tabs */}
            <Tabs
              value={tab}
              onChange={(_, newValue) => setTab(newValue)}
              sx={{
                mb: 3,
                minHeight: 36,
                "& .MuiTabs-indicator": { display: "none" },
              }}
            >
              {[
                "About",
                "General",
                "Storage, CPU & RAM",
                "Kernel",
                "Device Tree",
                "Custom vMMIO",
                "Sensor",
              ].map((label, index) => (
                <Tab
                  key={label}
                  label={label}
                  sx={{
                    textTransform: "none",
                    fontSize: 13,
                    minHeight: 32,
                    px: 2,
                    borderRadius: 0.5,
                    mr: 1,
                    backgroundColor: tab === index ? "#0b3c5d" : "transparent",
                    color: tab === index ? "#fff !important" : "#4b5563",
                    "&:hover": {
                      backgroundColor: tab === index ? "#072a44" : "#f3f4f6",
                    },
                  }}
                />
              ))}
            </Tabs>

            {/* ABOUT TAB */}
            {tab === 0 && (
              <Box
                sx={{
                  border: "1px solid #e6e9f0",
                  borderRadius: 0.5,
                  p: 3,
                }}
              >
                <Typography sx={{ fontSize: 13, color: "#6b7280", mb: 1 }}>
                  Device name
                </Typography>

                <TextField
                  fullWidth
                  size="small"
                  value={props.deviceName || "Cubic Corp"}
                  sx={{
                    mb: 3,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 0.5,
                      backgroundColor: "#fafbfc",
                    },
                  }}
                />

                <Box sx={{ borderTop: "1px solid #e6e9f0", pt: 2 }}>
                  <InfoRow
                    label="Created on"
                    value="Jan 21, 2025 at 6:43:45 PM"
                  />
                  <InfoRow label="Firmware name" value={props.deviceName || "Cubic Corp"} />
                  <InfoRow label="Specifications" value="rpi4b (product)" />
                </Box>
              </Box>
            )}

            {/* GENERAL TAB */}
            {tab === 1 && (
              <Box
                sx={{
                  border: "1px solid #e6e9f0",
                  borderRadius: 0.5,
                  p: 3,
                }}
              >
                {/* Boot Arguments */}
                <Typography sx={{ fontWeight: 600, fontSize: 16, mb: 1 }}>
                  Boot Arguments
                </Typography>

                <Typography
                  sx={{
                    fontSize: 13,
                    color: "#6b7280",
                    mb: 2,
                  }}
                >
                  These are arguments that will be passed to the kernel when the
                  device is started.
                </Typography>

                <TextField
                  fullWidth
                  multiline
                  minRows={4}
                  value={bootArgs}
                  onChange={(e) => setBootArgs(e.target.value)}
                  sx={{
                    mb: 1,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 0.5,
                      backgroundColor: "#fafbfc",
                      fontFamily: "monospace",
                      fontSize: 13,
                    },
                  }}
                />

                <Link
                  component="button"
                  underline="hover"
                  sx={{
                    fontSize: 13,
                    mb: 4,
                    display: "inline-block",
                  }}
                  onClick={() =>
                    setBootArgs(
                      "console=ttyLP0,115200 earlycon= root=/dev/mmcblk0p2",
                    )
                  }
                >
                  Reset to Default
                </Link>

                {/* Miscellaneous */}
                <Typography sx={{ fontWeight: 600, fontSize: 16, mb: 1 }}>
                  Miscellaneous
                </Typography>

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={disablePoweroff}
                      onChange={(e) => setDisablePoweroff(e.target.checked)}
                      size="small"
                    />
                  }
                  label={
                    <Typography sx={{ fontSize: 14 }}>
                      Disable automatic poweroff on VM hardware fault
                    </Typography>
                  }
                />
              </Box>
            )}

            {/* STORAGE, CPU & RAM TAB */}
            {tab === 2 && (
              <Box
                sx={{
                  border: "1px solid #e6e9f0",
                  borderRadius: 0.5,
                  p: 3,
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 600,
                    fontSize: 16,
                    mb: 0.5,
                  }}
                >
                  Storage, CPU & RAM
                </Typography>

                <Typography
                  sx={{
                    fontSize: 13,
                    color: "#6b7280",
                    mb: 3,
                  }}
                >
                  Change the storage volume, CPU cores & RAM for this device.
                </Typography>

                {/* Primary Storage */}
                <Box sx={{ mb: 3 }}>
                  <Typography sx={{ fontWeight: 600, fontSize: 14, mb: 0.5 }}>
                    Primary storage
                  </Typography>

                  <Typography sx={{ fontSize: 13, color: "#6b7280", mb: 1 }}>
                    The primary storage volume for this device.
                  </Typography>

                  <TextField
                    fullWidth
                    size="small"
                    value={storage}
                    onChange={(e) => setStorage(e.target.value)}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 0.5,
                        backgroundColor: "#fafbfc",
                        fontSize: 13,
                      },
                    }}
                  />
                </Box>

                {/* CPU Cores */}
                <Box sx={{ mb: 3 }}>
                  <Typography sx={{ fontWeight: 600, fontSize: 14, mb: 0.5 }}>
                    CPU cores
                  </Typography>

                  <Typography sx={{ fontSize: 13, color: "#6b7280", mb: 1 }}>
                    CPU core allocation for this device.
                  </Typography>

                  <TextField
                    fullWidth
                    size="small"
                    value={cpuCores}
                    onChange={(e) => setCpuCores(e.target.value)}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 0.5,
                        backgroundColor: "#fafbfc",
                        fontSize: 13,
                      },
                    }}
                  />
                </Box>

                {/* RAM */}
                <Box>
                  <Typography sx={{ fontWeight: 600, fontSize: 14, mb: 0.5 }}>
                    RAM
                  </Typography>

                  <Typography sx={{ fontSize: 13, color: "#6b7280", mb: 1 }}>
                    The amount of RAM for this device.
                  </Typography>

                  <TextField
                    fullWidth
                    size="small"
                    value={ram}
                    onChange={(e) => setRam(e.target.value)}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 0.5,
                        backgroundColor: "#fafbfc",
                        fontSize: 13,
                      },
                    }}
                  />
                </Box>
              </Box>
            )}

            {/* KERNEL TAB */}
            {tab === 3 && (
              <Box
                sx={{
                  border: "1px solid #e6e9f0",
                  borderRadius: 0.5,
                  p: 3,
                }}
              >
                {/* Custom Firmware Binary */}
                <Typography sx={{ fontWeight: 600, fontSize: 16, mb: 0.5 }}>
                  Custom Firmware Binary
                </Typography>

                <Typography
                  sx={{
                    fontSize: 13,
                    color: "#6b7280",
                    mb: 2,
                    maxWidth: 600,
                  }}
                >
                  Instead of the stock firmware binary, you can upload and use
                  any compatible firmware binary.
                </Typography>

                <UploadBox onFileSelect={(file) => setFirmwareFile(file)} />

                <Typography
                  sx={{
                    fontSize: 12,
                    color: "#9ca3af",
                    mt: 1,
                    mb: 4,
                  }}
                >
                  .zip file, raw binary, ELF executable, kernel loaded into RAM
                </Typography>

                {/* Cortex-M33 Kernel */}
                <Typography sx={{ fontWeight: 600, fontSize: 16, mb: 0.5 }}>
                  Cortex-M33 Kernel
                </Typography>

                <Typography
                  sx={{
                    fontSize: 13,
                    color: "#6b7280",
                    mb: 2,
                    maxWidth: 700,
                  }}
                >
                  The i.MX93 contains an embedded Cortex-M33 coprocessor that
                  runs alongside the Cortex-A55 cluster. Optionally upload an
                  M33 firmware image to be executed by this secondary core.
                </Typography>

                <UploadBox onFileSelect={(file) => setM33File(file)} />
              </Box>
            )}

            {/* DEVICE TREE TAB */}
            {tab === 4 && (
              <Box
                sx={{
                  border: "1px solid #e6e9f0",
                  borderRadius: 0.5,
                  p: 3,
                }}
              >
                <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                  <Typography sx={{ fontWeight: 600, fontSize: 16 }}>
                    Custom Device Tree
                  </Typography>

                  {/* Small Info Icon */}
                  <Box
                    sx={{
                      width: 16,
                      height: 16,
                      borderRadius: "50%",
                      border: "1px solid #d1d5db",
                      fontSize: 11,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#6b7280",
                    }}
                  >
                    i
                  </Box>
                </Box>

                <Typography
                  sx={{
                    fontSize: 13,
                    color: "#6b7280",
                    mb: 2,
                    maxWidth: 650,
                  }}
                >
                  The device tree provides information to the kernel on the
                  device's hardware. Instead of a stock device tree, you can
                  specify a custom one. It must be unencrypted and unpacked.
                </Typography>

                <UploadBox onFileSelect={(file) => setDeviceTreeFile(file)} />
              </Box>
            )}

            {/* CUSTOM vMMIO TAB */}
            {tab === 5 && (
              <Box
                sx={{
                  border: "1px solid #e6e9f0",
                  borderRadius: 0.5,
                  p: 3,
                }}
              >
                {/* Header */}
                <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                  <Typography sx={{ fontWeight: 600, fontSize: 16 }}>
                    Custom vMMIO
                  </Typography>

                  <Box
                    sx={{
                      width: 16,
                      height: 16,
                      borderRadius: "50%",
                      border: "1px solid #d1d5db",
                      fontSize: 11,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#6b7280",
                    }}
                  >
                    i
                  </Box>
                </Box>

                <Typography
                  sx={{
                    fontSize: 13,
                    color: "#6b7280",
                    mb: 3,
                    maxWidth: 650,
                  }}
                >
                  Custom virtual MMIO ranges can be added to the device and
                  driven through a TCP socket.
                </Typography>

                {/* Table Header */}
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#6b7280",
                    mb: 2,
                    maxWidth: 600,
                  }}
                >
                  <Box>Start</Box>
                  <Box>Size</Box>
                  <Box>IRQ</Box>
                </Box>

                {/* Rows */}
                {vmmioList.map((item, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr 1fr",
                      gap: 2,
                      mb: 2,
                      maxWidth: 600,
                    }}
                  >
                    <TextField
                      size="small"
                      value={item.start}
                      onChange={(e) => {
                        const updated = [...vmmioList];
                        updated[index].start = e.target.value;
                        setVmmioList(updated);
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 0.5,
                          backgroundColor: "#fafbfc",
                          fontSize: 13,
                        },
                      }}
                    />

                    <TextField
                      size="small"
                      value={item.size}
                      onChange={(e) => {
                        const updated = [...vmmioList];
                        updated[index].size = e.target.value;
                        setVmmioList(updated);
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 0.5,
                          backgroundColor: "#fafbfc",
                          fontSize: 13,
                        },
                      }}
                    />

                    <TextField
                      size="small"
                      value={item.irq}
                      onChange={(e) => {
                        const updated = [...vmmioList];
                        updated[index].irq = e.target.value;
                        setVmmioList(updated);
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 0.5,
                          backgroundColor: "#fafbfc",
                          fontSize: 13,
                        },
                      }}
                    />
                  </Box>
                ))}

                {/* Add Button */}
                <Button
                  variant="contained"
                  onClick={handleAddVmmio}
                  sx={{
                    mt: 1,
                    backgroundColor: "#111827",
                    textTransform: "none",
                    fontSize: 13,
                    px: 2.5,
                    py: 0.8,
                    borderRadius: 0.5,
                    boxShadow: "none",
                    "&:hover": {
                      backgroundColor: "#000000",
                      boxShadow: "none",
                    },
                  }}
                >
                  Add Custom vMMIO
                </Button>
              </Box>
            )}

            {/* SENSOR TAB */}
            {tab === 6 && (
              <Box
                sx={{
                  border: "1px solid #e6e9f0",
                  borderRadius: 0.5,
                  p: 3,
                }}
              >
                {/* Header */}
                <Typography sx={{ fontWeight: 600, fontSize: 16, mb: 2 }}>
                  Camera and Microphone
                </Typography>
                <Typography sx={{ fontSize: 13, color: "#6b7280" }}>
                  Enable the camera and microphone for this browser.
                </Typography>

                {/* Enable Toggle */}
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography sx={{ fontSize: 14, fontWeight: 500 }}>
                      Enable
                    </Typography>

                    <Switch
                      checked={sensorEnabled}
                      onChange={(e) => setSensorEnabled(e.target.checked)}
                      size="small"
                      sx={{
                        "& .MuiSwitch-switchBase.Mui-checked": {
                          color: "#0b3c5d",
                        },
                        "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                          {
                            backgroundColor: "#0b3c5d",
                          },
                      }}
                    />
                  </Box>
                </Box>

                {/* Camera Select */}
                <Typography sx={{ fontSize: 13, color: "#6b7280", mb: 1 }}>
                  Camera
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  select
                  SelectProps={{ native: true }}
                  value={selectedCamera}
                  onChange={(e) => setSelectedCamera(e.target.value)}
                  sx={{
                    mb: 3,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 0.5,
                      backgroundColor: "#fafbfc",
                      fontSize: 13,
                    },
                  }}
                >
                  <option value="">Select...</option>
                  <option value="camera1">Integrated Camera</option>
                  <option value="camera2">External USB Camera</option>
                </TextField>

                {/* Microphone Select */}
                <Typography sx={{ fontSize: 13, color: "#6b7280", mb: 1 }}>
                  Microphone
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  select
                  SelectProps={{ native: true }}
                  value={selectedMic}
                  onChange={(e) => setSelectedMic(e.target.value)}
                  sx={{
                    mb: 3,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 0.5,
                      backgroundColor: "#fafbfc",
                      fontSize: 13,
                    },
                  }}
                >
                  <option value="">Select...</option>
                  <option value="mic1">Built-in Microphone</option>
                  <option value="mic2">External Microphone</option>
                </TextField>

                {/* Upload Section */}
                <Typography sx={{ fontSize: 13, color: "#6b7280", mb: 1 }}>
                  Upload
                </Typography>
                <UploadBox onFileSelect={(file) => console.log(file)} />

                <Typography
                  sx={{
                    textAlign: "center",
                    fontSize: 12,
                    color: "#9ca3af",
                    my: 2,
                  }}
                >
                  or
                </Typography>

                {/* Media URL */}
                <Typography sx={{ fontSize: 13, color: "#6b7280", mb: 1 }}>
                  Media URL
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="https://example.com/video.mp4"
                  value={mediaUrl}
                  onChange={(e) => setMediaUrl(e.target.value)}
                  sx={{
                    mb: 3,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 0.5,
                      backgroundColor: "#fafbfc",
                      fontSize: 13,
                    },
                  }}
                />

                {/* Buttons */}
                <Box display="flex" gap={2}>
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: "#6b7280",
                      textTransform: "none",
                      fontSize: 13,
                      px: 2.5,
                      py: 0.8,
                      borderRadius: 0.5,
                      boxShadow: "none",
                      "&:hover": { backgroundColor: "#4b5563" },
                    }}
                  >
                    Play media
                  </Button>

                  <Button
                    variant="outlined"
                    sx={{
                      textTransform: "none",
                      fontSize: 13,
                      px: 2.5,
                      py: 0.8,
                      borderRadius: 0.5,
                    }}
                  >
                    Stop media
                  </Button>
                </Box>
              </Box>
            )}
          </Grid>

        
        </Grid>
      </Box>
    </Box>
  );
}
