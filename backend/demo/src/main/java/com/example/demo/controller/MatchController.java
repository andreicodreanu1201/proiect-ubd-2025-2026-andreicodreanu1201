package com.example.demo.controller;

import com.example.demo.model.Match;
import com.example.demo.model.Team;
import com.example.demo.model.Tournament;
import com.example.demo.repository.MatchRepository;
import com.example.demo.repository.TeamRepository;
import com.example.demo.repository.TournamentRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/matches")

public class MatchController {

    private final MatchRepository matchRepo;
    private final TeamRepository teamRepo;
    private final TournamentRepository tournamentRepo;

    public MatchController(MatchRepository matchRepo, TeamRepository teamRepo, TournamentRepository tournamentRepo){
        this.matchRepo = matchRepo;
        this.teamRepo = teamRepo;
        this.tournamentRepo = tournamentRepo;
    }

    @GetMapping
    public List<Match> getAll(){
        return matchRepo.findAll();
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Match match) {
        try {
            // 1. Validare Turneu
            if (match.getTournament() != null && match.getTournament().getId() != null) {
                Tournament t = tournamentRepo.findById(match.getTournament().getId())
                        .orElseThrow(() -> new RuntimeException("Tournament not found"));

                // VALIDARE DATA
                if (match.getMatchDate() != null) {
                    java.time.LocalDate matchDay = match.getMatchDate().toLocalDate();

                    if (matchDay.isBefore(t.getStartDate()) || matchDay.isAfter(t.getEndDate())) {
                        throw new RuntimeException("Data invalida! Turneul este intre " + t.getStartDate() + " si " + t.getEndDate()+ ". Modifica data meciului!" );
                    }
                }
                match.setTournament(t);
            }

            // 2. Validare Echipe
            if (match.getTeam1() != null && match.getTeam1().getId() != null) {
                Team t1 = teamRepo.findById(match.getTeam1().getId()).orElseThrow();
                match.setTeam1(t1);
            }
            if (match.getTeam2() != null && match.getTeam2().getId() != null) {
                Team t2 = teamRepo.findById(match.getTeam2().getId()).orElseThrow();
                match.setTeam2(t2);
            }

            // Salvare cu succes
            return ResponseEntity.ok(matchRepo.save(match));

        } catch (RuntimeException e) {
            // Aici prindem eroarea si o trimitem la React
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Match updated) {
        try {
            Match m = matchRepo.findById(id)
                    .orElseThrow(() -> new RuntimeException("Match not found with id: " + id));

            // Actualizari simple
            m.setScoreTeam1(updated.getScoreTeam1());
            m.setScoreTeam2(updated.getScoreTeam2());
            m.setMatchDate(updated.getMatchDate());

            // Validare Turneu la update (Daca se schimba sau daca verificam data noua pe turneul vechi)
            Tournament t = m.getTournament();
            if (updated.getTournament() != null && updated.getTournament().getId() != null) {
                t = tournamentRepo.findById(updated.getTournament().getId()).orElseThrow();
                m.setTournament(t);
            }

            // VALIDARE DATA LA UPDATE
            if (m.getMatchDate() != null && t != null) {
                java.time.LocalDate matchDay = m.getMatchDate().toLocalDate();
                if (matchDay.isBefore(t.getStartDate()) || matchDay.isAfter(t.getEndDate())) {
                    throw new RuntimeException("Data invalida! Turneul este intre " + t.getStartDate() + " si " + t.getEndDate() + ". Modifica data meciului!" );
                }
            }

            // Actualizare Echipe
            if (updated.getTeam1() != null && updated.getTeam1().getId() != null) {
                m.setTeam1(teamRepo.findById(updated.getTeam1().getId()).orElseThrow());
            }
            if (updated.getTeam2() != null && updated.getTeam2().getId() != null) {
                m.setTeam2(teamRepo.findById(updated.getTeam2().getId()).orElseThrow());
            }

            return ResponseEntity.ok(matchRepo.save(m));

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id){
        matchRepo.deleteById(id);
    }
}
