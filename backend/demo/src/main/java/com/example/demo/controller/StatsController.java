package com.example.demo.controller;

import com.example.demo.model.Stats;
import com.example.demo.model.Player;
import com.example.demo.model.Tournament;
import com.example.demo.repository.StatsRepository;
import com.example.demo.repository.PlayerRepository;
import com.example.demo.repository.TournamentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/stats")
@CrossOrigin(origins = "http://localhost:5173")
public class StatsController {

    @Autowired
    private StatsRepository statsRepository;

    @Autowired
    private PlayerRepository playerRepository;

    @Autowired
    private TournamentRepository tournamentRepository;

    @PostMapping
    public ResponseEntity<?> createOrUpdateStats(@RequestBody Map<String, Object> payload) {
        try {
            Long playerId = Long.valueOf(payload.get("playerId").toString());
            Long tournamentId = Long.valueOf(payload.get("tournamentId").toString());
            Integer kills = Integer.valueOf(payload.get("kills").toString());
            Integer deaths = Integer.valueOf(payload.get("deaths").toString());
            Integer assists = Integer.valueOf(payload.get("assists").toString());

            Optional<Player> playerOpt = playerRepository.findById(playerId);
            Optional<Tournament> tournamentOpt = tournamentRepository.findById(tournamentId);

            if (!playerOpt.isPresent()) {
                return ResponseEntity.badRequest().body("Player not found");
            }
            if (!tournamentOpt.isPresent()) {
                return ResponseEntity.badRequest().body("Tournament not found");
            }

            Player player = playerOpt.get();
            Tournament tournament = tournamentOpt.get();

            // Check if stats already exist for this player-tournament combo
            Optional<Stats> existingStats = statsRepository.findByPlayerAndTournament(player, tournament);

            Stats stats;
            if (existingStats.isPresent()) {
                // Update existing stats
                stats = existingStats.get();
            } else {
                // Create new stats
                stats = new Stats();
                stats.setPlayer(player);
                stats.setTournament(tournament);
            }

            stats.setKills(kills);
            stats.setDeaths(deaths);
            stats.setAssists(assists);

            Stats savedStats = statsRepository.save(stats);
            return ResponseEntity.ok(savedStats);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error saving stats: " + e.getMessage());
        }
    }
}