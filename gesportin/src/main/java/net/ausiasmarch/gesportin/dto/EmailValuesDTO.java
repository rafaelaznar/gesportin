package net.ausiasmarch.gesportin.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class EmailValuesDTO {

    @NotBlank
    @Email
    private String mailTo;
}
