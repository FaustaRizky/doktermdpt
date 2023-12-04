/*!

=========================================================
* Argon Dashboard React - v1.2.3
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

// reactstrap components
import { useState } from "react";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Col,
} from "reactstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    specialization: "",
    alamat: "",
    nomorHp: "",
    photo: null,
    password: "",
    email: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (event) => {
    const { name, value, files } = event.target
    if (name === "photo" && files && files.length > 0) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prevFormData) => ({
          ...prevFormData,
          [name]: reader.result.split(",")[1],  // Extract base64 data
        }));
      };
      reader.readAsDataURL(files[0]);
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };

  const apiUrl = process.env.REACT_APP_API_URL;

  const handleRegistration = (e) => {
    e.preventDefault();
    axios.post(`${apiUrl}/api/doctors`, formData)
    .then((response) => {
      console.log(response);
      toast.success(response.data);
      // Handle response from the server according to your application needs
    })
    .catch((error) => {
      toast.error(error.response.data.error);
    });
};

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };  

  // Fungsi untuk mengonversi base64 menjadi Blob
  const base64ToBlob = (base64String) => {
    const byteCharacters = atob(base64String);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    return new Blob(byteArrays, { type: "image/jpeg" }); // Ganti "image/jpeg" sesuai dengan format gambar yang sesuai
  };

  const isValidBase64 = (str) => {
    try {
      return btoa(atob(str)) === str;
    } catch (e) {
      return false;
    }
  };

  if (
    formData.photo !== null &&
    formData.photo !== undefined &&
    isValidBase64(formData.photo.split(",")[1])
  ) {
    const base64Image = formData.photo.split(",")[1];
    const imageBlob = base64ToBlob(base64Image);
    formData.append("photo", imageBlob, "profile.jpg");
  }
  // Kirim data ke server menggunakan metode POST atau PUT
  fetch(`${apiUrl}/auth/login`, {
    method: "POST", // Ganti menjadi "POST" jika endpoint hanya mendukung metode POST
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
    body: formData,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      // Tidak perlu menguraikan response karena bukan JSON
      toast.success("Profile updated successfully");
      setTimeout(() => {
        window.location.reload();
      }, 3000);
      // Misalnya, setelah berhasil mengirim data ke server, Anda dapat melakukan navigasi atau memberikan notifikasi kepada pengguna.
    })
    .catch((error) => {
      // Tangani kesalahan jika terjadi kesalahan saat mengirim data ke server
      console.error("Error:", error);
    });

  
  return (
    <>
      <Col lg="6" md="8">
        <Card className="bg-secondary shadow border-0">
          <CardHeader className="bg-transparent pb-2">
            <div className="text-muted text-center mt-3 mb-3">
            <ToastContainer />
              <small>Sign up with</small>
            </div>
          </CardHeader>
          <CardBody className="px-lg-2 py-lg-2">
            <Form role="form" onSubmit={handleRegistration}>
              <FormGroup>
                <InputGroup className="input-group-alternative mb-3">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-hat-3" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Nama Lengkap"
                    type="text"
                    id="fullName"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative mb-3">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-hat-3" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Spesialis"
                    type="text"
                    id="specialization"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleInputChange}
                    required
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative mb-3">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-hat-3" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Alamat"
                    type="text"
                    id="alamat"
                    name="alamat"
                    onChange={handleInputChange}
                    value={formData.alamat}
                    required
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-email-83" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Nomor Hp"
                    type="text"
                    id="nomorHp"
                    name="nomorHp"
                    onChange={handleInputChange}
                    value={formData.nomorHp}
                    required
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative mb-3">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      {/* <i className="ni ni-lock-circle-open" /> */}
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    style={{
                      paddingBottom: "3px",
                      paddingTop: "-20px",
                      paddingLeft: "3px",
                    }}
                    type="file"
                    onChange={handleInputChange}
                    accept="image/*"
                    name="photo"
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative mb-3">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-lock-circle-open" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Password"
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                  <FontAwesomeIcon
                    icon={showPassword ? faEyeSlash : faEye}
                    onClick={togglePasswordVisibility}
                    className="absolute top-1 right-2 cursor-pointer mt-3"
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative mb-3">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-lock-circle-open" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="email"
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </InputGroup>
              </FormGroup>
                {/* <div className="text-muted font-italic">
                  <small>
                    password strength:{" "}
                    <span className="text-success font-weight-700">strong</span>
                  </small>
                </div> */}
              <div className="text-center mb-4">
                <Button className="mt-5" color="primary" type="submit">
                  Create account
                </Button>
              </div>
            </Form>
          </CardBody>
        </Card>
      </Col>
    </>
  );
};

export default Register;
