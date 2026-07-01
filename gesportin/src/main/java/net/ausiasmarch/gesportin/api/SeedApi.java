package net.ausiasmarch.gesportin.api;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import net.ausiasmarch.gesportin.service.SeedService;

@RestController
@RequestMapping("/admin")
public class SeedApi {

    @Autowired
    private SeedService oSeedService;

    /** Seed missing system data (idempotent — skips tables already populated). */
    @PostMapping("/seed")
    public ResponseEntity<Long> seed() {
        return ResponseEntity.ok(oSeedService.seed());
    }

    /**
     * Full transactional reset: deletes ALL data in safe FK order, then
     * re-seeds the minimum system data (tipousuario, rolusuario, club, 3 users).
     * Admin check is performed once at the start of the single transaction.
     */
    @PostMapping("/reset")
    public ResponseEntity<Long> reset() {
        return ResponseEntity.ok(oSeedService.reset());
    }

    /**
     * Same as /reset but also resets AUTO_INCREMENT counters to 1 for all
     * tables via ALTER TABLE, so that the next fill() inserts IDs starting
     * from 1 (or from max(id)+1 for tables that keep seed rows).
     *
     * IMPORTANT: the two steps must be called through the Spring proxy
     * (i.e. from here, not from within SeedService) to ensure
     * @Transactional on reset() is honoured by Spring AOP.
     */
    @PostMapping("/resetcomplete")
    public ResponseEntity<Long> resetComplete() {
        long seeded = oSeedService.reset();            // @Transactional — own TX, commits
        oSeedService.resetAutoIncrements();            // DDL — outside any TX
        return ResponseEntity.ok(seeded);
    }

    /**
     * Centralized data generation: ensures there are 10 clubs (using existing
     * ones including Gesportin id=1, creating new ones to reach 10), and for
     * each club generates deeply nested congruent data in all tables.
     * Does NOT reset — data is added on top of existing records.
     * Returns a map with the count of records created per entity.
     */
    @PostMapping("/generate")
    public ResponseEntity<Map<String, Long>> generate() {
        Map<String, Long> counts = oSeedService.generateData();
        return ResponseEntity.ok(counts);
    }
}
