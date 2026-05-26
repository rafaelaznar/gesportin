package net.ausiasmarch.gesportin.api;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import net.ausiasmarch.gesportin.dto.ChangePasswordDTO;
import net.ausiasmarch.gesportin.dto.EmailValuesDTO;
import net.ausiasmarch.gesportin.service.AccountRecoveryService;

@CrossOrigin(origins = "*", allowedHeaders = "*", maxAge = 3600)
@RestController
@RequestMapping("/email")
public class EmailController {

    private final AccountRecoveryService accountRecoveryService;

    public EmailController(AccountRecoveryService accountRecoveryService) {
        this.accountRecoveryService = accountRecoveryService;
    }

    @PostMapping("/recover-password")
    public ResponseEntity<Void> recoverPassword(
            @Valid @RequestBody EmailValuesDTO emailValuesDTO,
            BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        accountRecoveryService.requestPasswordRecovery(emailValuesDTO.getMailTo());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/change-password")
    public ResponseEntity<Void> changePassword(
            @Valid @RequestBody ChangePasswordDTO changePasswordDTO,
            BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        accountRecoveryService.changePassword(changePasswordDTO);
        return ResponseEntity.ok().build();
    }
}
