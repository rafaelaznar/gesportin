package net.ausiasmarch.gesportin.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ChangePasswordDTO {

    @NotBlank
    private String tokenPassword;

    @NotBlank
    private String password;

    @NotBlank
    private String confirmPassword;
}
