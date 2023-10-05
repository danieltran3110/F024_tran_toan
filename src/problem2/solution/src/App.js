import "./App.css";
import Button from "@mui/material/Button";
import { PRICES_TOKENS, TOKENS } from "./utils/constants";
import SwapCallsIcon from "@mui/icons-material/SwapCalls";
import Select from "./components/Select";
import { useEffect, useState } from "react";
import { Alert, CircularProgress, Snackbar } from "@mui/material";
import useFormValidation from "./hooks/useFormValidation";

function App() {
  const [sendingToken, setSendingToken] = useState(TOKENS.ETH);
  const [receivingToken, setReceivingToken] = useState(TOKENS.LUNA);
  const [isSwap, setIsSwap] = useState(true);
  const [listToken, setListToken] = useState([]);
  const [receivingInput, setReceivingInput] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const initialValue = {
    sending: "",
  };

  const validate = values => {
    let errors = {};

    if (!values.sending) {
      errors.sending = "Sending is required";
    } else if (values.sending < 0) {
      errors.sending = "Sending must be greater than 0";
    }
    return errors;
  };

  const onSubmit = () => {
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSuccess(true);
      resetFields();
      setIsSubmitting(false);
    }, 1000);
  };

  const { handleChange, handleSubmit, values, errors, resetFields } =
    useFormValidation(initialValue, validate, onSubmit);

  useEffect(() => {
    updateTokenInformation();
  }, []);

  useEffect(() => {
    calculateReceivingInput(values.sending);
  }, [values]);

  const getPrices = async () => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(PRICES_TOKENS);
      }, 500);
    });
  };

  const updateTokenInformation = async () => {
    const tokens = await getPrices();
    const tokenInfo = tokens.map((token, index) => {
      const currency = token.currency.toUpperCase();
      return {
        ...token,
        icon: TOKENS[currency].icon,
        name: token.currency,
      };
    });
    setListToken(tokenInfo);
  };

  const onSendingTokenChange = token => {
    setSendingToken(token);
  };

  const onReceivingTokenChange = token => {
    setReceivingToken(token);
  };

  const onSwapToken = () => {
    setIsSwap(false);
    setTimeout(() => {
      const temp = sendingToken;
      setSendingToken(receivingToken);
      setReceivingToken(temp);
      setIsSwap(true);
      resetFields();
    }, 200);
  };

  const calculateReceivingInput = sendingValue => {
    if (sendingValue > 0) {
      const receivingInfo = listToken.find(
        token => token.name === receivingToken.name
      );
      const receiveValue = sendingValue * receivingInfo.price;
      setReceivingInput(receiveValue.toFixed(4));
    } else {
      setReceivingInput(0);
    }
  };

  const handleCloseSuccessSnackbar = () => {
    setIsSuccess(false);
  };

  const handleSendingChange = e => {
    let { value } = e.target;
    if (/^\d*$/.test(value) || value === "") {
      value = value === "" ? 0 : parseInt(value);
      handleChange(e);
    }
  };

  return (
    <div className="App">
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={isSuccess}
        autoHideDuration={3000}
        onClose={handleCloseSuccessSnackbar}
      >
        <Alert severity="success" sx={{ width: "100%" }}>
          This is a success message!
        </Alert>
      </Snackbar>
      <div className="wrap">
        <form className="form" onSubmit={handleSubmit}>
          <h1>Swap Token</h1>
          <div className="tokens">
            <div className="token">
              <h2>Sending</h2>
              <figure>
                <img src={sendingToken.icon} alt="USC" />
              </figure>
              <div className={errors["sending"] ? "input error" : "input"}>
                <input
                  type="text"
                  name={"sending"}
                  value={values.sending}
                  onChange={e => handleSendingChange(e)}
                  placeholder="0.0"
                />
                {isSwap && !!listToken.length ? (
                  <Select
                    options={listToken}
                    selected={sendingToken.name}
                    onChange={onSendingTokenChange}
                  />
                ) : (
                  <CircularProgress color="secondary" />
                )}
                {errors["sending"] && (
                  <p className="error-msg">{errors["sending"]}</p>
                )}
              </div>
            </div>
            <figure className="swap-icon" onClick={onSwapToken}>
              <SwapCallsIcon />
            </figure>
            <div className="token">
              <h2>Receiving</h2>
              <figure>
                <img src={receivingToken.icon} alt="USC" />
              </figure>
              <div className="input">
                <input
                  className="input-readonly"
                  type="text"
                  readOnly
                  placeholder="0.0"
                  value={receivingInput}
                />
                {isSwap && !!listToken.length ? (
                  <Select
                    options={listToken}
                    selected={receivingToken.name}
                    onChange={onReceivingTokenChange}
                  />
                ) : (
                  <CircularProgress color="secondary" />
                )}
              </div>
            </div>
          </div>
          <Button
            type="submit"
            className="button"
            variant="contained"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <CircularProgress size={25} color="inherit" />
            ) : (
              "CONFIRM SWAP"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default App;
