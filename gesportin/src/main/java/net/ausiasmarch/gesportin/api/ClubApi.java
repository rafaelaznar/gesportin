package net.ausiasmarch.gesportin.api;

import java.io.IOException;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import net.ausiasmarch.gesportin.entity.ClubEntity;
import net.ausiasmarch.gesportin.service.ClubService;

@CrossOrigin(origins = "*", allowedHeaders = "*", maxAge = 3600)
@RestController
@RequestMapping("/club")
public class ClubApi {

    @org.springframework.beans.factory.annotation.Autowired
    private ClubService oClubService;

    @GetMapping("/{id}")
    public ResponseEntity<ClubEntity> get(@PathVariable Long id) {
        return ResponseEntity.ok(oClubService.get(id));
    }

    @GetMapping
    public ResponseEntity<org.springframework.data.domain.Page<ClubEntity>> getPage(org.springframework.data.domain.Pageable pageable) {
        return ResponseEntity.ok(oClubService.getPage(pageable));
    }

    @PostMapping
    public ResponseEntity<ClubEntity> create(@RequestBody ClubEntity clubEntity) {
        return ResponseEntity.ok(oClubService.create(clubEntity));
    }

    @PutMapping
    public ResponseEntity<ClubEntity> update(@RequestBody ClubEntity clubEntity) {
        return ResponseEntity.ok(oClubService.update(clubEntity));
    }

    @PatchMapping("/picture/{id}")
    public void updatePicture(@PathVariable Long id, @RequestPart("image") MultipartFile image) throws IOException {
        oClubService.updatePicture(id, image.getBytes());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Long> delete(@PathVariable Long id) {
        return ResponseEntity.ok(oClubService.delete(id));
    }

    @PostMapping("/fill/{cantidad}")
    public ResponseEntity<Long> fill(@PathVariable Long cantidad) {
        return ResponseEntity.ok(oClubService.fill(cantidad));
    }

    @DeleteMapping("/empty")
    public ResponseEntity<Long> empty() {
        return ResponseEntity.ok(oClubService.empty());
    }

    @GetMapping("/count")
    public ResponseEntity<Long> count() {
        return ResponseEntity.ok(oClubService.count());
    }

    @GetMapping("/fillgesportin")
    public ResponseEntity<Long> fillGesportin() {
        return ResponseEntity.ok(oClubService.fillGesportin());
    }

}
