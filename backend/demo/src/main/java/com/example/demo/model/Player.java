package com.example.demo.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "player")
public class Player {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String role;
    private int age;

    @ManyToOne
    @JoinColumn(name = "team_id")
    @JsonIgnoreProperties("players")
    private Team team;

    @OneToMany(mappedBy = "player", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties("player")
    private List<Stats> stats;

    public Player() {}

    public Player(Long id, String name, String role, int age, Team team) {
        this.id = id;
        this.name = name;
        this.role = role;
        this.age = age;
        this.team = team;
    }

    public Player(String name, String role, int age, Team team) {
        this.name = name;
        this.role = role;
        this.age = age;
        this.team = team;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getRole() {
        return role;
    }

    public int getAge() {
        return age;
    }

    public Team getTeam() {
        return team;
    }

    public List<Stats> getStats() {
        return stats;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public void setTeam(Team team) {
        this.team = team;
    }

    public void setStats(List<Stats> stats) {
        this.stats = stats;
    }
}