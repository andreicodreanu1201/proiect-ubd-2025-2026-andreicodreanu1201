package com.example.demo.controller;

import com.example.demo.model.Player;
import com.example.demo.model.Team;
import com.example.demo.model.Stats;
import com.example.demo.repository.PlayerRepository;
import com.example.demo.repository.TeamRepository;
import com.example.demo.repository.StatsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/players")
@CrossOrigin(origins = "http://localhost:5173")
public class PlayerController {

    @Autowired
    private PlayerRepository playerRepository;

    @Autowired
    private TeamRepository teamRepository;

    @Autowired
    private StatsRepository statsRepository;

    @GetMapping
    public ResponseEntity<List<Player>> getAllPlayers() {
        List<Player> players = playerRepository.findAll();
        // For each player, fetch their stats
        players.forEach(player -> {
            List<Stats> stats = statsRepository.findAll().stream()
                    .filter(s -> s.getPlayer().getId().equals(player.getId()))
                    .toList();
            // This will be serialized with the player
        });
        return ResponseEntity.ok(players);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getPlayerById(@PathVariable Long id) {
        Optional<Player> player = playerRepository.findById(id);
        if (player.isPresent()) {
            return ResponseEntity.ok(player.get());
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<?> createPlayer(@RequestBody Map<String, Object> payload) {
        try {
            Player player = new Player();
            player.setName(payload.get("name").toString());
            player.setRole(payload.get("role").toString());
            player.setAge(Integer.valueOf(payload.get("age").toString()));

            if (payload.get("teamId") != null) {
                Long teamId = Long.valueOf(payload.get("teamId").toString());
                Optional<Team> team = teamRepository.findById(teamId);
                team.ifPresent(player::setTeam);
            }

            Player savedPlayer = playerRepository.save(player);
            return ResponseEntity.ok(savedPlayer);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error creating player: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updatePlayer(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
        try {
            Optional<Player> existingPlayer = playerRepository.findById(id);
            if (!existingPlayer.isPresent()) {
                return ResponseEntity.notFound().build();
            }

            Player player = existingPlayer.get();
            player.setName(payload.get("name").toString());
            player.setRole(payload.get("role").toString());
            player.setAge(Integer.valueOf(payload.get("age").toString()));

            if (payload.get("teamId") != null) {
                Long teamId = Long.valueOf(payload.get("teamId").toString());
                Optional<Team> team = teamRepository.findById(teamId);
                team.ifPresent(player::setTeam);
            } else {
                player.setTeam(null);
            }

            Player updatedPlayer = playerRepository.save(player);
            return ResponseEntity.ok(updatedPlayer);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error updating player: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePlayer(@PathVariable Long id) {
        try {
            if (!playerRepository.existsById(id)) {
                return ResponseEntity.notFound().build();
            }
            playerRepository.deleteById(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error deleting player: " + e.getMessage());
        }
    }
}