import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity
} from "react-native";
import { SafeAreaConsumer } from "react-native-safe-area-context";
import Spinner from "react-native-loading-spinner-overlay";
import AsyncStorage from "@react-native-community/async-storage";
import { connect } from "react-redux";
import AwesomeAlert from "react-native-awesome-alerts";
import axios from "axios";
import AppConstant from "../../constants/AppConstant";
import Server from "../../constants/Server";
import WrappedTextInput from "./components/WrappedTextInput";
import { setupUserOnStart } from "../../actions/UserActions";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const upadding = Math.round(SCREEN_WIDTH * 0.03);

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      emailError: undefined,
      passwordError: undefined,
      isLoading: false,
      alertVisible: false,
      alertText: ""
    };
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.login) {
      AsyncStorage.setItem("userToken", "abc");
      nextProps.navigation.navigate("settingupdatabase");
      return false;
    }
    return true;
  }

  checkEmail() {
    const email = this.state.email.trim();
    if (!email.includes("@")) {
      this.setState({ emailError: "Please enter valid email." });
    } else {
      this.setState({ emailError: false });
    }
  }

  checkPassword() {
    const { password } = this.state;
    const pass = password.split("");
    let flag1 = 0;
    let flag2 = 0;
    let flag3 = 0;
    pass.forEach(element => {
      if (/^[A-Z]{1}$/.test(element)) {
        flag1 = 1;
      }

      if (/^[a-z]{1}$/.test(element)) {
        flag2 = 1;
      }

      if (/^[0-9]{1}$/.test(element)) {
        flag3 = 1;
      }
    });

    if (!(flag1 == 1 && flag2 == 1 && flag3 == 1)) {
      this.setState({
        passwordError:
          "Should contain atleast one capital, one small letter and one digit"
      });
      return true;
    }
    this.setState({ passwordError: false });
    return false;
  }

  onButtonPresss = () => {
    this.props.navigation.navigate("signup");
  };

  showAlert(message) {
    this.setState({ alertText: message, alertVisible: true });
  }

  handleError(error) {
    function isNetworkError(err) {
      return !!err.isAxiosError && !err.response;
    }

    let message;
    if (isNetworkError(error)) {
      message = "Network Error";
    } else {
      console.log(error);
      const responseJson = error.response.data;
      message = responseJson.error;
    }
    this.setState({ isLoading: false });
    this.showAlert(message);
  }

  onNext() {
    const { email, password, emailError, passwordError } = this.state;
    if (email.length === 0) {
      this.showAlert("Please enter email.");
      return;
    }
    if (password.length === 0) {
      this.showAlert("Please enter password");
      return;
    }
    if (typeof emailError === "string") {
      this.showAlert(emailEror);
      return;
    }
    if (this.checkPassword()) {
      this.showAlert("Check your password");
      return;
    }

    if (typeof passwordError === "string") {
      this.showAlert(passwordError);
      return;
    }
    const data = {
      email,
      password
    };
    this.setState({ isLoading: true });
    const { setupUserOnStart, navigation } = this.props;
    const url = `${Server}/login`;

    axios
      .post(url, data)
      .then(response => {
        const responseJson = response.data;
        console.log(responseJson);
        this.setState({ isLoading: false });
        setupUserOnStart(responseJson);
        navigation.navigate("settingupdatabase", { signup: false });
      })
      .catch(error => {
        console.log("Error while login", error);
        this.handleError(error);
      });
  }

  handleAlertConfirm() {
    this.setState({ alertText: "", alertVisible: false });
  }

  render() {
    const textInputProps = {
      placeholderTextColor: "#777",
      selectionColor: AppConstant.appColor,
      autoCorrect: false,
      keyboardType: "default",
      returnKeyType: "done",
      maxLength: 50
    };
    return (
      <SafeAreaConsumer>
        {insets => (
          <View
            style={{
              flex: 1,
              paddingTop: insets.top,
              backgroundColor: "white"
            }}
          >
            <Spinner
              visible={this.state.isLoading}
              color={AppConstant.appColor}
            />

            <View style={{ paddingHorizontal: "8%", flex: 1 }}>
              <View
                style={{
                  flex: 2,
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <Text
                  style={{ fontSize: 40, color: "black", fontWeight: "500" }}
                >
                  Welcome to Task!!
                </Text>
                <Text
                  style={{
                    fontSize: 30,
                    color: AppConstant.appColor,
                    fontWeight: "500"
                  }}
                >
                  {"Make's you work easy "}
                </Text>
              </View>
              <View style={{ flex: 1.2, justifyContent: "space-between" }}>
                <View>
                  <View>
                    <WrappedTextInput
                      {...textInputProps}
                      placeholder="Email"
                      onBlur={this.checkEmail.bind(this)}
                      onChangeText={email => {
                        this.setState({ email, emailError: false });
                      }}
                      value={this.state.email}
                      error={this.state.emailError}
                    />
                  </View>
                  <View>
                    <WrappedTextInput
                      {...textInputProps}
                      placeholder="Password"
                      onBlur={this.checkPassword.bind(this)}
                      onChangeText={password => {
                        this.setState({ password, passwordError: false });
                      }}
                      secureTextEntry
                      value={this.state.password}
                      error={this.state.passwordError}
                    />
                  </View>

                  <View style={{ marginTop: 20 }}>
                    <TouchableOpacity
                      style={{
                        alignSelf: "center",
                        alignItems: "center",
                        justifyContent: "center",
                        height: 40,
                        width: "70%",
                        borderRadius: 5,
                        elevation: 2,
                        backgroundColor: AppConstant.appColor,
                        marginRight: 10
                      }}
                      onPress={() => {
                        this.onNext();
                      }}
                      activeOpacity={0.8}
                    >
                      <Text
                        style={{
                          color: "#ffffff",
                          fontSize: 15
                        }}
                      >
                        {"Sign in "}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    marginBottom: "5%"
                  }}
                >
                  <View
                    style={{
                      justifyContent: "center",
                      alignItems: "center"
                    }}
                  >
                    <Text style={{ fontSize: 15 }}>unregistered user ?</Text>
                  </View>
                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={this.onButtonPresss}
                  >
                    <Text
                      style={{
                        color: AppConstant.appColor,
                        fontSize: 15,
                        marginLeft: 5,
                        fontWeight: "500",
                        fontWeight: "bold"
                      }}
                    >
                      {"SignUp "}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <AwesomeAlert
              show={this.state.alertVisible}
              showProgress={false}
              title="Error"
              message={this.state.alertText}
              closeOnTouchOutside
              closeOnHardwareBackPress={false}
              showCancelButton={false}
              showConfirmButton
              confirmText="OK"
              cancelText={null}
              confirmButtonColor={AppConstant.appColor}
              onConfirmPressed={() => {
                this.handleAlertConfirm();
              }}
            />
          </View>
        )}
      </SafeAreaConsumer>
    );
  }
}

const mapStateToProps = state => ({});
export default connect(
  mapStateToProps,
  {
    setupUserOnStart
  }
)(Login);

const styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
    backgroundColor: "white"
  },
  insideContainer: {
    flexDirection: "column",

    height: SCREEN_HEIGHT * 0.85,
    width: SCREEN_WIDTH * 0.9,
    borderRadius: upadding,
    backgroundColor: "white",
    elevation: 5,
    marginTop: upadding * 2
  },
  textStyle: {
    color: "black",
    fontFamily: "cursive",
    fontSize: upadding * 1.6
  },
  Individualcontainerstyle: {
    marginBottom: upadding
  },
  titleStyle: {
    fontSize: upadding * 3,
    fontWeight: "bold",
    color: "black",
    fontFamily: "cursive",
    marginBottom: upadding
  },
  inputStyle: {
    marginTop: upadding,
    height: upadding * 1.5,
    borderBottomColor: "#4B0082",
    borderRadius: upadding / 2,
    borderBottomWidth: upadding * 0.3,
    backgroundColor: "white"
  },
  Viewstyle: {
    marginBottom: upadding / 4
  },
  Buttonstyle: {
    padding: upadding / 4
  }
});
