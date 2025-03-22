import { CustomFilledInput } from "../../components/custom-input"

export const FormInput = ({formField, handleInputChange, value}, props) => {

    return (
            <CustomFilledInput
                {...props}
                label={formField.label}
                onChange={handleInputChange}
                value={value}
                name={formField.name}
                fullWidth
                mb={2}
            />
    )

}