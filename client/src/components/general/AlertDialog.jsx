import React, { useEffect } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

export default function AlertDialog(props) {
    const [open, setOpen] = React.useState(false);

    useEffect(() => {
        if (props.open) handleClickOpen();
    }, [props, open]);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = (e) => {
        setOpen(false);
        if (props.buttonFn && e.currentTarget.name === "primary") {
            props.buttonFn();
        } else if (
            props.other &&
            props.other.secondaryButtonFn &&
            e.currentTarget.name === "secondary"
        ) {
            // console.log("here", !!props.other);
            props.other.secondaryButtonFn();
        }
    };

    return (
        <div>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{props.title}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {props.contentText}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        name="primary"
                        onClick={handleClose}
                        color="primary"
                    >
                        {props.buttonText}
                    </Button>
                    {props.other && (
                        <Button
                            name="secondary"
                            onClick={handleClose}
                            color="primary"
                        >
                            {props.other.secondaryButtonText || "No"}
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        </div>
    );
}
