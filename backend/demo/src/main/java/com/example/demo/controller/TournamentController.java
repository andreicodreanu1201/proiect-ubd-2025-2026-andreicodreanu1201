package com.example.demo.controller;

import com.example.demo.model.Tournament;
import com.example.demo.repository.TournamentRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tournaments")

public class TournamentController {

    private TournamentRepository repo;

    public TournamentController(TournamentRepository repo){
        this.repo = repo;
    }

    @GetMapping
    public List<Tournament> getAll(){
        return repo.findAll();
    }

    @PostMapping
    public Tournament create(@RequestBody Tournament tournament){
        return repo.save(tournament);
    }

    @PutMapping("/{id}")
    public Tournament update(@PathVariable Long id, @RequestBody Tournament updated){
        Tournament t = repo.findById(id).orElseThrow();

        t.setName(updated.getName());
        t.setStartDate(updated.getStartDate());
        t.setEndDate(updated.getEndDate());

        return repo.save(t);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id){
        repo.deleteById(id);
    }
}
